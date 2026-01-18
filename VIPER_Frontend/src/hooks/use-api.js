import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:5001';

export const useApi = () => {
  const [overlayState, setOverlayState] = useState({
    ai: false,
    gas: false,
    thermal: false,
  });

  const fetchOverlayState = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/overlay`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOverlayState(data);
    } catch (error) {
      console.error('Failed to fetch overlay state:', error);
    }
  }, []);

  const setOverlay = useCallback(async (name, action) => {
    try {
      const response = await fetch(`${API_URL}/overlay/${name}/${action}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOverlayState(data);
    } catch (error) {
      console.error(`Failed to set overlay ${name} to ${action}:`, error);
    }
  }, []);

  useEffect(() => {
    fetchOverlayState();
  }, [fetchOverlayState]);
  
  const getFeedUrl = () => `${API_URL}/ai_feed`;

  return { overlayState, setOverlay, fetchOverlayState, getFeedUrl };
};
