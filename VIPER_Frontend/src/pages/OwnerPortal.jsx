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
    <div className="min-h-screen bg-slate-950 p-8 text-white font-sans">
      <header className="mb-12 border-l-4 border-orange-600 pl-6">
        <h1 className="text-4xl font-black text-white tracking-tight">Global Asset Hub</h1>
        <p className="text-slate-400 text-sm font-semibold mt-2">Authorized Manager: {user.email}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-lg p-8 border border-slate-800 shadow-xl">
          <h2 className="text-slate-300 font-bold mb-6 uppercase text-xs tracking-widest">Cloud Identifications</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {cloudLogs.map((log, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-slate-700 transition-colors">
                <div>
                  <div className="text-xs text-slate-500 font-mono mb-1">{log.time}</div>
                  <div className="font-bold text-orange-400 uppercase text-sm tracking-wide">{log.type} IDENTIFIED</div>
                </div>
                <div className="px-3 py-1 bg-orange-600/10 text-orange-400 rounded text-xs font-bold border border-orange-600/30">{log.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-8 border border-slate-800 flex flex-col justify-center items-center shadow-xl">
            <h3 className="text-slate-400 font-bold uppercase text-xs mb-6 tracking-widest">Health Index</h3>
            <div className="text-8xl font-black text-orange-500 tracking-tighter mb-6">61%</div>
            <p className="text-center text-sm text-slate-400 px-4 mb-8">Detected <span className="text-orange-400 font-bold">+150%</span> degradation rate from anomalous events.</p>
            <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all uppercase text-sm tracking-wide">Generate Audit PDF</button>
        </div>
      </div>
    </div>
  );
};

export default OwnerPortal;