'use client';
import { useEffect, useRef } from 'react';
import mixpanel from 'mixpanel-browser';
import { v4 as uuidv4 } from 'uuid';

export default function MixPanel() {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '');

  const sessionIdRef = useRef<string>(uuidv4());
  const sessionStartTimeRef = useRef<number>(Date.now());

  async function trackUserProperties() {
    const userAgent = navigator.userAgent;
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection ||
      {};
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timestamp = new Date().toISOString();

    interface LocationData {
      country?: string;
      city?: string;
      region?: string;
      org?: string;
    }

    let locationData: LocationData = {};

    try {
      const response = await fetch(
        'https://ipinfo.io/json?token=51d01c84bf637b'
      );
      if (response.ok) {
        locationData = await response.json();
      } else {
        console.error('Failed to fetch location data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }

    const {
      country = '',
      city = '',
      region = '',
      org: networkProvider = '',
    } = locationData || {};

    console.log('User Properties:', {
      userAgent,
      connectionType: connection.effectiveType || 'unknown',
      screenResolution,
      timestamp,
      sessionId: sessionIdRef.current,
      country,
      city,
      region,
      networkProvider,
    });

    /* if (mixpanel.people) {
      mixpanel.people.set({
        $os: navigator.platform,
        $browser: userAgent,
        $browser_version: navigator.appVersion,
        $screen_resolution: screenResolution,
        $timestamp: timestamp,
        $device: userAgent,
        $connection_type: connection ? connection.effectiveType : 'unknown',
        $language: navigator.language,
        country,
        city,
        region,
        network_provider: networkProvider,
        // Add more properties as needed
      });
    } else {
      console.error('mixpanel.people is undefined');
    }*/

    mixpanel.track('Session Started', {
      session_id: sessionIdRef.current,
      timestamp: timestamp,
      device_type: userAgent,
      os: navigator.platform,
      browser_name: userAgent,
      browser_version: navigator.appVersion,
      screen_resolution: screenResolution,
      connection_type: connection ? connection.effectiveType : 'unknown',
      country,
      city,
      region,
      network_provider: networkProvider,
      language: navigator.language,
      // Add more properties as needed
    });

    console.log('Session Started Event Tracked');
  }

  const MILLISECONDS_TO_SECONDS = 1000;
  function trackSessionEnd() {
    const sessionEndTime = Date.now();
    const sessionDuration =
      (sessionEndTime - sessionStartTimeRef.current) / MILLISECONDS_TO_SECONDS;
    const timestamp = new Date().toISOString();

    console.log('Session Ended:', {
      session_id: sessionIdRef.current,
      timestamp: timestamp,
      session_duration: sessionDuration,
    });

    mixpanel.track('Session Ended', {
      session_id: sessionIdRef.current,
      timestamp: timestamp,
      session_duration: sessionDuration,
    });

    console.log('Session Ended Event Tracked');
  }

  useEffect(() => {
    trackUserProperties();

    window.addEventListener('beforeunload', trackSessionEnd);

    return () => {
      window.removeEventListener('beforeunload', trackSessionEnd);
    };
  }, []);

  return null;
}
