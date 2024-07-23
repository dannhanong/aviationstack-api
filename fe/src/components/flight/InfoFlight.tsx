import React from 'react';
import { IoAirplaneSharp } from 'react-icons/io5';
import { FlightInfo } from '../../models/FlightInfo';
import { FlightData } from '../../models/FlightData';
import moment from 'moment-timezone';
import { differenceInMinutes, parseISO } from 'date-fns';

type FlightInfoProps = {
    flightInfo: FlightInfo;
    flight: FlightData;
};

const InfoFlight: React.FC<FlightInfoProps> = ({ flightInfo, flight }) => {
    // const convertToUTC = (isoString: string): string => {
    //     const date = moment(isoString).utc();
    //     return date.format('YYYY-MM-DDTHH:mm:ss[Z]');
    // };
    
    // const calculateTimeDifference = (endIsoString: string) => {
    //     const endTime = moment.utc(endIsoString); // Thời gian kết thúc
    //     const now = convertToUTC(new Date().toISOString()); // Lấy thời gian hiện tại trong UTC
    //     console.log('now', now);
        
    
    //     const totalMinutes = endTime.diff(now, 'minutes');
    //     const hours = Math.abs(Math.floor(totalMinutes / 60));
    //     const minutes = Math.abs(totalMinutes % 60);
    
    //     return { hours, minutes, totalMinutes: Math.abs(totalMinutes) };
    // };
    
    // const calculateElapsedTime = (startIso: string) => {
    //     const startTime = moment.utc(startIso);
    //     const now = moment.utc(); // Lấy thời gian hiện tại trong UTC
    //     const totalMinutes = now.diff(startTime, 'minutes');
    //     const hours = Math.abs(Math.floor(totalMinutes / 60));
    //     const minutes = Math.abs(totalMinutes % 60);
    //     return { hours, minutes, totalMinutes: Math.abs(totalMinutes) };
    // };

    const calculate2TimeDifference = (isoString1: string, isoString2: string) => {
        const endTime = moment.utc(isoString1);
        const startTime = moment.utc(isoString2);        
        const totalMinutes = endTime.diff(startTime, 'minutes');
        const hours = Math.abs(Math.floor(totalMinutes / 60));
        const minutes = Math.abs(totalMinutes % 60);
        return { hours, minutes, totalMinutes: Math.abs(totalMinutes) };
    };

    const calculate2Minutes = (isoString1: string, isoString2: string) => {
        const endTime = moment.utc(isoString1);
        const startTime = moment.utc(isoString2);        
        const totalMinutes = endTime.diff(startTime, 'minutes');
        return totalMinutes;
    };

    // const elapsed = flight.departure?.actual 
    //     ? calculateElapsedTime(flight.departure.actual) 
    //     : flight.departure?.estimated 
    //         ? calculateElapsedTime(flight.departure.estimated) 
    //         : null;

    const totalTravelTime = flight.arrival?.actual && flight.departure?.actual 
        ? calculate2TimeDifference(flight.arrival.actual, flight.departure.actual) 
        : flight.arrival?.estimated && flight.departure?.actual 
            ? calculate2TimeDifference(flight.arrival.estimated, flight.departure.actual) 
            : null;

    // const remainingTime = flight.arrival?.actual 
    //     ? calculateTimeDifference(flight.arrival.actual) 
    //     : flight.arrival?.estimated 
    //         ? calculateTimeDifference(flight.arrival.estimated) 
    //         : null;

    // const getFormattedUTCString = (date: Date): string => {
    //     const isoString = date.toISOString();
    //     return isoString;
    // };

    const getTime = (s: number, t1: string, t2: string, s1: number): { hours: number, minutes: number } => {
        const v: number = s*1000 / calculate2Minutes(t1, t2);
        const totalMinutes = s1*1000 / v;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor((totalMinutes % 60));
        return { hours, minutes };
    }

    return (
        <div>
            {
                (typeof flightInfo.far !== 'number' || typeof flightInfo.dflownNumber !== 'number' || typeof flightInfo.dtoGoNumber !== 'number') ||
                    (!flightInfo.far || !flightInfo.dflownNumber || !flightInfo.dtoGoNumber)
                    ?
                    <div>
                        <div className='text-center text-red-600'>Can't show result</div>
                    </div>
                    :
                    <div>
                        <div className="max-w-6xl mx-auto p-4">
                            <div className="relative text-center">
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-green-300"></div>
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-green-700"
                                    style={{ width: `${(flightInfo.dflownNumber / flightInfo.far) * 100}%` }}
                                ></div>
                                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-green-700 rounded-full"></div>
                                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full"></div>
                                <div
                                    className="absolute top-1/2"
                                    style={{ left: `${(flightInfo.dflownNumber / flightInfo.far) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                                >
                                    <IoAirplaneSharp className='size-6 text-green-700' />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4">
                            <div className="text-left">
                                <div className="bg-blue-900 text-white text-center p-1 rounded h-8">
                                    {
                                        flight.arrival?.actual
                                        ? `${getTime(flightInfo.far, flight.arrival.actual, flight.departure?.actual ?? '', flightInfo.dflownNumber).hours}h ${getTime(flightInfo.far, flight.arrival.actual, flight.departure?.actual ?? '', flightInfo.dflownNumber).minutes}m elapsed`
                                        : `${getTime(flightInfo.far, flight.arrival?.estimated ?? '', flight.departure?.actual ?? '', flightInfo.dflownNumber).hours}h ${getTime(flightInfo.far, flight.arrival?.estimated ?? '', flight.departure?.actual ?? '', flightInfo.dflownNumber).minutes}m elapsed`
                                    }
                                </div>
                                <div className='mt-2 text-sm mx-2'>{Math.round(flightInfo.dflownNumber)} mi flown</div>
                            </div>
                            <div className="text-center">
                                <div className='mt-2 text-sm mx-2'>
                                    {
                                        flight.flight_status === 'active' && totalTravelTime && (
                                            `${totalTravelTime.hours}h ${totalTravelTime.minutes}m total travel time`
                                        )
                                    }
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-blue-900 text-white text-center p-1 rounded h-8">
                                    {
                                        flight.arrival?.actual
                                        ? `${getTime(flightInfo.far, flight.arrival.actual, flight.departure?.actual ?? '', flightInfo.dtoGoNumber).hours}h ${getTime(flightInfo.far, flight.arrival.actual, flight.departure?.actual ?? '', flightInfo.dtoGoNumber).minutes}m remaining`
                                        : `${getTime(flightInfo.far, flight.arrival?.estimated ?? '', flight.departure?.actual ?? '', flightInfo.dtoGoNumber).hours}h ${getTime(flightInfo.far, flight.arrival?.estimated ?? '', flight.departure?.actual ?? '', flightInfo.dtoGoNumber).minutes}m remaining`
                                    }
                                </div>
                                <div className='mt-2 text-sm mx-2'>{Math.round(flightInfo.dtoGoNumber)} mi to go</div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}

export default InfoFlight;
