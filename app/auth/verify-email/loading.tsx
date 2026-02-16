import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 mx-auto text-teal-600 animate-spin mb-4" />
                <p className="text-slate-600">Loading...</p>
            </div>
        </div>
    );
}
