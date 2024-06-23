declare module 'react-native-push-notification' {
    import { Component } from 'react';

    export interface PushNotificationObject {
        /* Android only properties */
        ticker?: string;
        autoCancel?: boolean;
        largeIcon?: string;
        smallIcon?: string;
        bigText?: string;
        subText?: string;
        color?: string;
        vibrate?: boolean;
        vibration?: number;
        tag?: string;
        group?: string;
        ongoing?: boolean;
        priority?: 'max' | 'high' | 'low' | 'min' | 'default';
        visibility?: 'private' | 'public' | 'secret';
        importance?: 'default' | 'max' | 'high' | 'low' | 'min' | 'none' | 'unspecified';
        allowWhileIdle?: boolean;

        /* iOS only properties */
        alertAction?: any;
        category?: any;
        userInfo?: any;

        /* iOS and Android properties */
        id?: number;
        title: string;
        message: string;
        playSound?: boolean;
        soundName?: string;
        number?: string;
        repeatType?: 'time' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
        actions?: string;
    }

    export interface PushNotificationScheduleObject extends PushNotificationObject {
        date: Date;
    }

    export interface PushNotificationPermissions {
        alert?: boolean;
        badge?: boolean;
        sound?: boolean;
    }

    export interface PushNotification {
        configure(options: {
            onRegister: (token: { os: string, token: string }) => void;
            onNotification: (notification: PushNotificationObject) => void;
            onAction?: (notification: any) => void;
            onRegistrationError?: (err: any) => void;
            permissions?: PushNotificationPermissions;
            popInitialNotification?: boolean;
            requestPermissions?: boolean;
        }): void;

        localNotification(notification: PushNotificationObject): void;
        localNotificationSchedule(notification: PushNotificationScheduleObject): void;
        cancelLocalNotifications(details: { id: string }): void;
        cancelAllLocalNotifications(): void;
        setApplicationIconBadgeNumber(number: number): void;
        getApplicationIconBadgeNumber(callback: (number: number) => void): void;
        popInitialNotification(callback: (notification: PushNotificationObject) => void): void;
        checkPermissions(callback: (permissions: PushNotificationPermissions) => void): void;
        requestPermissions(permissions?: PushNotificationPermissions): Promise<PushNotificationPermissions>;
    }

    const PushNotification: PushNotification;
    export default PushNotification;
}
