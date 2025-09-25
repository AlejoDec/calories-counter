import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { getApp } from "firebase/app";

const ViewsCounter = (viewsCount: number) => {
    const [views, setViews] = useState(viewsCount);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const db = getFirestore(getApp());
        const counterRef = doc(db, "views", "counter");

        const fetchViews = async () => {
            try {
                console.log("🔄 Cargando vistas...");
                setError(null);
                const docSnap = await getDoc(counterRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const count = data && typeof data.count === "number" ? data.count : 0;
                    console.log("✅ Vistas cargadas:", count);
                    setViews(count);
                } else {
                    console.log("📝 Creando documento de contador...");
                    await setDoc(counterRef, { count: 0 });
                    setViews(0);
                }
            } catch (err) {
                console.error("❌ Error al cargar vistas:", err);
                setError("Error al cargar el contador de vistas");
                setViews(0);
            }
        };

        fetchViews();

        const handleVisibilityChange = async () => {
            if (document.visibilityState === "visible") {
                try {
                    console.log("👁️ Usuario regresó a la pestaña, incrementando contador...");
                    setError(null);
                    await updateDoc(counterRef, { count: increment(1) });
                    const docSnap = await getDoc(counterRef);
                    const data = docSnap.data();
                    const newCount = data?.count || 0;
                    console.log("🔢 Nuevo contador:", newCount);
                    setViews(newCount);
                } catch (err) {
                    console.error("❌ Error al incrementar contador:", err);
                    setError("Error al actualizar el contador");
                }
            }
        };

        document.addEventListener("DOMContentLoaded", handleVisibilityChange);

        return () => {
            document.removeEventListener("DOMContentLoaded", handleVisibilityChange);
        };
    }, []);

    return (
        <div>
            {error ? (
                <p className="text-lg text-red-500 mt-2">⚠️ {error}</p>
            ) : (
                <p className="text-lg text-green-600 mt-2">Visitantes: <span className="font-bold">{views}</span></p>
            )}
        </div>
    )
}

export default ViewsCounter;