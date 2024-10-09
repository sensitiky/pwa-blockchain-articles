'use client';
import { useEffect, useRef } from 'react';
import mixpanel from 'mixpanel-browser';
import { v4 as uuidv4 } from 'uuid';

export default function MixPanel() {
  const MIX_URL = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  mixpanel.init(MIX_URL || '', { track_pageview: true });

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

    if (mixpanel.people) {
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
    }

    mixpanel.track('Session Started', {
      session_id: sessionIdRef.current,
      timestamp: timestamp,
      device_type: userAgent,
    });
  }

  const MILLISECONDS_TO_SECONDS = 1000;
  function trackSessionEnd() {
    const sessionEndTime = Date.now();
    const sessionDuration =
      (sessionEndTime - sessionStartTimeRef.current) / MILLISECONDS_TO_SECONDS;
    console.log(sessionDuration);
    const timestamp = new Date().toISOString();

    mixpanel.track('Session Ended', {
      session_id: sessionIdRef.current,
      timestamp: timestamp,
      session_duration: sessionDuration,
    });
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
