// ============================================
// KidsCare Pro - Firebase Storage Service
// Photo uploads, signature storage, documents
// ============================================

import {
    ref,
    uploadBytes,
    uploadString,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

// ----------------------------------------
// Storage Service
// ----------------------------------------
export const storageService = {
    // Upload a file (photo, document)
    async uploadFile(path: string, file: File): Promise<string> {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    },

    // Upload a base64 data URL (for signatures)
    async uploadDataUrl(path: string, dataUrl: string): Promise<string> {
        const storageRef = ref(storage, path);
        await uploadString(storageRef, dataUrl, 'data_url');
        return getDownloadURL(storageRef);
    },

    // Upload session activity photo
    async uploadActivityPhoto(sessionId: string, file: File): Promise<string> {
        const filename = `${Date.now()}_${file.name}`;
        return storageService.uploadFile(`sessions/${sessionId}/photos/${filename}`, file);
    },

    // Upload trust protocol signature
    async uploadSignature(bookingId: string, role: 'parent' | 'sitter', dataUrl: string): Promise<string> {
        return storageService.uploadDataUrl(
            `bookings/${bookingId}/signatures/${role}_${Date.now()}.png`,
            dataUrl
        );
    },

    // Upload incident photo
    async uploadIncidentPhoto(incidentId: string, file: File): Promise<string> {
        const filename = `${Date.now()}_${file.name}`;
        return storageService.uploadFile(`incidents/${incidentId}/photos/${filename}`, file);
    },

    // Upload sitter document (certification, ID)
    async uploadSitterDocument(sitterId: string, file: File): Promise<string> {
        const filename = `${Date.now()}_${file.name}`;
        return storageService.uploadFile(`sitters/${sitterId}/documents/${filename}`, file);
    },

    // Upload hotel logo
    async uploadHotelLogo(hotelId: string, file: File): Promise<string> {
        return storageService.uploadFile(`hotels/${hotelId}/logo.png`, file);
    },

    // Get download URL for a path
    async getUrl(path: string): Promise<string> {
        const storageRef = ref(storage, path);
        return getDownloadURL(storageRef);
    },

    // Delete a file
    async deleteFile(path: string): Promise<void> {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    },
};
