import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CaptureSession, AngleId, CapturedPhoto, GraftEstimationResult } from '@types';
import { loadSessions, saveSessions } from '@services/storage';
import { v4 as uuid } from 'uuid';

interface SessionContextValue {
  sessions: CaptureSession[];
  activeSession?: CaptureSession;
  startSession: (locale: string) => CaptureSession;
  appendPhoto: (angleId: AngleId, base64: string, uri?: string) => void;
  completeSession: (estimate?: GraftEstimationResult) => void;
  setActiveSession: (id?: string) => void;
  updateSessionEstimate: (sessionId: string, estimate: GraftEstimationResult) => void;
  loading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<CaptureSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await loadSessions();
      setSessions(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveSessions(sessions);
    }
  }, [sessions, loading]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [sessions, activeSessionId]
  );

  const startSession = (locale: string): CaptureSession => {
    const session: CaptureSession = {
      id: uuid(),
      createdAt: Date.now(),
      locale,
      photos: []
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    return session;
  };

  const setActiveSession = (id?: string) => {
    setActiveSessionId(id);
  };

  const appendPhoto = (angleId: AngleId, base64: string, uri?: string) => {
    if (!activeSessionId) {
      return;
    }
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              photos: [
                ...session.photos.filter((photo) => photo.angleId !== angleId),
                { angleId, base64, timestamp: Date.now(), uri }
              ]
            }
          : session
      )
    );
  };

  const completeSession = (estimate?: GraftEstimationResult) => {
    if (!activeSessionId) {
      return;
    }
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              graftEstimation: estimate ?? session.graftEstimation
            }
          : session
      )
    );
    setActiveSessionId(undefined);
  };

  const updateSessionEstimate = (sessionId: string, estimate: GraftEstimationResult) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, graftEstimation: estimate } : session))
    );
  };

  const value = useMemo(
    () => ({
      sessions,
      activeSession,
      startSession,
      appendPhoto,
      completeSession,
      setActiveSession,
      updateSessionEstimate,
      loading
    }),
    [sessions, activeSession, loading]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessions must be used within SessionProvider');
  }
  return context;
};
