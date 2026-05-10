import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';
import { toast } from 'sonner';
import { ICurrentPaginatedResponse, IPaginatedResponseMeta, IPaginationFilter } from 'src/types/pagination-fillter';
import { ICapturedImage, ICreateRecordingSession, IRecordingSession } from 'src/types/recording';

// SWR Options
const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// Get All Recording Sessions for a Patient
export function useGetRecordingSessions(params: IPaginationFilter) {
    const queryParams = new URLSearchParams();

    if (params?.searchFor) queryParams.append('searchFor', params.searchFor);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
    if (params?.searchedValue) queryParams.append('searchedValue', params.searchedValue);

    const url = `${endpoints.recording.session}?${queryParams.toString()}`;

    const { data, isLoading, error, isValidating } = useSWR<{
        data: IRecordingSession[];
        meta?: IPaginatedResponseMeta;
    }>(url, fetcher, swrOptions);

    return useMemo(
        () => ({
            recordingSessions: data?.data || [],
            recordingSessionsMeta: data?.meta || undefined,
            isLoading,
            recordingSessionsError: error,
            recordingSessionsValidating: isValidating,
            recordingSessionsEmpty: !isLoading && (!data?.data || data.data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );
}

// Get By Camera Capture ID
export function useGetCameraCaptureById(id: number | null) {

    const url = id ? endpoints.recording.getById(id) : null;

    const { data, isLoading, error, isValidating } = useSWR<{
        data: IRecordingSession;
        meta: ICurrentPaginatedResponse;
    }>(url, fetcher, swrOptions);

    return useMemo(
        () => ({
            recordingSession: data?.data || null,
            recordingSessionMeta: data?.meta || undefined,
            recordingSessionLoading: isLoading,
            recordingSessionError: error,
            recordingSessionValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );
}

export async function startRecordingSession(data: ICreateRecordingSession) {
    const url = endpoints.recording.sessionStart;
    try {
        const res = await axios.post(url, data);
        if (res?.data?.status === true) {
            toast.success('Recording session started successfully');
            return res?.data?.data;
        }
        toast.error(`Failed to start recording session: ${res?.data?.message || 'Unknown error'}`);
        return null;
    }
    catch (error: any) {
        toast.error(`Failed to start recording session: ${error?.response?.data || error.message}`);
        return null;
    }
}
export async function uploadRecordingChunk(params: {
    sessionId: string;
    index: number;
    blob: Blob;
    mimeType: string;
}) {
    const url =
        `${endpoints.recording.sessionChunks(params.sessionId)}?index=${params.index}`;
    try {
        const res = await axios.post(url, params.blob, {
            headers: {
                'Content-Type': params.mimeType || 'application/octet-stream',
                'X-Session-Id': params.sessionId,
                'X-Chunk-Index': String(params.index),
            },
        });
        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}


export async function stopRecordingSession(sessionId: string) {
    const url = endpoints.recording.sessionStop(sessionId);
    try {
        const res = await axios.post(url);
        if (res?.data?.status === true) {
            toast.success('Recording session stopped successfully');
            return res?.data;
        }
        toast.error(`Failed to stop recording session: ${res?.data?.message || 'Unknown error'}`);
        return null;
    }
    catch (error: any) {
        toast.error(`Failed to stop recording session: ${error?.response?.data || error.message}`);
        return null;
    }

}

/** Upload a captured still image for a session. */
export async function uploadCapturedImage(params: {
    sessionId: string;
    blob: Blob;
    name: string;
}) {
    const url = endpoints.recording.sessionCapture(params.sessionId);
    try {
        const formData = new FormData();
        formData.append('image', params.blob, params.name);
        const res = await axios.post(url,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        if (res?.data?.status === true) {
            toast.success('Captured image uploaded successfully');
            return res?.data;
        }
        toast.error(`Failed to upload captured image: ${res?.data?.message || 'Unknown error'}`);
        return null;
    }
    catch (error: any) {
        toast.error(`Failed to upload captured image: ${error?.response?.data || error.message}`);
        return null;
    }
}

// ── SWR Hooks ────────────────────────────────────────────────────────────────

/** Fetch all captured images for a session. */
export function useGetCaptures(sessionId: string | null) {
    const url = sessionId ? endpoints.recording.getAllCaptures(sessionId) : null;

    const { data, isLoading, mutate } = useSWR<ICapturedImage[]>(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return useMemo(
        () => ({
            captures: data || [],
            capturesLoading: isLoading,
            refreshCaptures: mutate,
        }),
        [data, isLoading, mutate]
    );
}
