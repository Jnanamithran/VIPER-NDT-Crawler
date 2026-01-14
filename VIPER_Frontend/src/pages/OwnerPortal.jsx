import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../firebase";
import LoginForm from "../components/LoginForm";

const OwnerPortal = () => {
  const [user, setUser] = useState(null);
  const [cloudLogs, setCloudLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (user) {
      const missionRef = ref(db, 'missions/');
      onValue(missionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Flatten cloud data for display
          const flattened = Object.values(data).flatMap(m => Object.values(m));
          setCloudLogs(flattened.reverse());
        }
      });
    }
    return () => unsubscribe();
  }, [user]);

  if (!user) return <LoginForm />;

  return (
    <div className="min-h-screen bg-slate-950 p-10 text-white font-sans">
      <header className="mb-12 border-l-8 border-orange-600 pl-6">
        <h1 className="text-4xl font-black text-orange-500 italic uppercase">Global Asset Hub</h1>
        <p className="text-slate-500 font-bold">Authorized Manager: {user.email}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <h2 className="text-slate-400 font-bold mb-6 tracking-widest">LIVE CLOUD IDENTIFICATIONS</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {cloudLogs.map((log, i) => (
              <div key={i} className="flex justify-between items-center p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <div>
                  <div className="text-xs text-slate-500 font-mono">{log.time}</div>
                  <div className="font-bold text-red-500 uppercase tracking-widest">{log.type} IDENTIFIED</div>
                </div>
                <div className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black">{log.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col justify-center items-center">
            <h3 className="text-slate-500 font-black uppercase text-sm mb-4">Structural Health Index</h3>
            <div className="text-9xl font-black text-red-600 tracking-tighter mb-6">61%</div>
            <p className="text-center text-sm text-slate-400 px-6">Identified <b>+150%</b> degradation rate based on anomalous event density.</p>
            <button className="mt-10 w-full py-4 bg-orange-600 hover:bg-orange-700 text-black font-black rounded-xl transition-all">GENERATE AUDIT PDF</button>
        </div>
      </div>
    </div>
  );
};

export default OwnerPortal;