import BrokenHealthKit, { HealthKitPermissions } from 'react-native-health';

const NativeModules = require('react-native').NativeModules;
const AppleHealthKit = NativeModules.AppleHealthKit as typeof BrokenHealthKit;
AppleHealthKit.Constants = BrokenHealthKit.Constants;

const healthKitOptions: any = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.SleepAnalysis],
    write: [],
  },
};

/**
 * Initializes Apple HealthKit with the required permissions.
 */
export const initHealthKit = (): Promise<boolean> => {
  console.log({ AppleHealthKit });
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(healthKitOptions, (error: string) => {
      if (error) {
        reject(
          new Error('HealthKit permissions were not granted. Please enable them in Settings.'),
        );
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * Fetches sleep data from Apple HealthKit from the given start date.
 * @param startDate - The start date for the sleep data query
 * @returns A promise that resolves to an array of SleepSample
 */
export const getSleepData = (startDate: Date): Promise<any[]> => {
  const options: any = {
    startDate: startDate.toISOString(),
  };

  return new Promise((resolve, reject) => {
    AppleHealthKit.getSleepSamples(options, (err: string, results: any[]) => {
      if (err) {
        reject(new Error(`Error fetching sleep data: ${err}`));
      } else {
        resolve(results);
      }
    });
  });
};
