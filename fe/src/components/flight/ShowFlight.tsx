import React, { useEffect } from 'react';
import { IoIosSettings, IoMdInformationCircle } from 'react-icons/io';
import InfoFlight from './InfoFlight';
import { FlightData } from '../../models/FlightData';
import { parseISO, differenceInMinutes } from 'date-fns';
import { FlightInfo } from '../../models/FlightInfo';
import { getFlightDetail } from '../../services/FlightResponse.service';
import moment from 'moment';

type FlightProps = {
    flight: FlightData;
    manaInfo: boolean;
    loading: boolean;
};

const ShowFlight: React.FC<FlightProps> = ({ flight, manaInfo, loading }) => {
    const [isShow, setIsShow] = React.useState<boolean>(false);
    const [flightInfo, setFlightInfo] = React.useState<FlightInfo | undefined>();
    const [diffDeparture, setDiffDeparture] = React.useState<any>();
    const [diffArrival, setDiffArrival] = React.useState<any>();

    useEffect(() => {
        if (loading) {
            console.log('Đang tải...');
        }
    }, [loading]);

    const getDayOfWeek = (dateString: string): string => {
        const date = new Date(dateString);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[date.getDay()];
    };

    const showDetail = (flight_number: string, flight_status: string) => {
        setIsShow(!isShow);
    };

    const fetchFlightDetail = async (flight_number: string, flight_status: string) => {
        try {
            const response = await getFlightDetail(flight_number, flight_status);
            setFlightInfo(response);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const convertToDesiredFormat = (isoString: string) => {
        const date = moment(isoString);
        // date.set({ hour: 9, minute: 20, second: 0, millisecond: 0 });
        return date.utc().format('YYYY-MM-DDTHH:mm:ssZ')+'';
    };

    const calculate2Minutes = (isoString1: string, isoString2: string) => {
        const endTime = moment.utc(isoString1);
        const startTime = moment.utc(isoString2);        
        const totalMinutes = endTime.diff(startTime, 'minutes');
        return totalMinutes;
    };

    const getTime = (s: number, t1: string, t2: string, s1: number): { hours: number, minutes: number } => {
        const v: number = s*1000 / calculate2Minutes(t1, t2);
        const totalMinutes = s1*1000 / v;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor((totalMinutes % 60));
        return { hours, minutes };
    }

    React.useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
        const flightNumber = flight.flight?.number ?? '';
        const flightStatus = flight.flight_status ?? '';

        if (isShow && flightNumber && flightStatus==='active') {
            fetchFlightDetail(flightNumber, flightStatus);
            intervalId = setInterval(() => {
                fetchFlightDetail(flightNumber, flightStatus);
            }, 60000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isShow, flight.flight?.number, flight.flight_status]);

    // const calculateTimeDifference = (isoString: string) => {
    //     const endTime = parseISO(isoString);
    //     const now = new Date();
    //     const totalMinutes = differenceInMinutes(endTime, now);
    //     const hours = (Math.floor(totalMinutes / 60));
    //     const minutes = (totalMinutes % 60);
    //     return { hours, minutes, totalMinutes: (totalMinutes) };
    // };

    const calculateTimeDifference = (isoString: string) => {
        const endTime = moment.utc(isoString);
        const now = moment.utc(convertToDesiredFormat(new Date().toISOString()));
        const totalMinutes = endTime.diff(now, 'minutes');
        const hours = Math.abs(Math.floor(totalMinutes / 60));
        const minutes = Math.abs(totalMinutes % 60);
        return { hours, minutes, totalMinutes: Math.abs(totalMinutes) };
    };
    
    return (
        <div className="max-w-6xl mx-auto bg-white p-20 shadow-lg my-3">
            <div className="flex justify-between">
                <div className='flex'>
                    <img
                        src="https://i.pinimg.com/originals/7a/ec/17/7aec17946661a88378269d0b642b61f3.png"
                        alt="Vietnam Airlines"
                        className="h-12 mr-10"
                    />
                    <div className='max-w-2xl text-left'>
                        <div className="text-2xl font-bold">{flight.airline?.name}</div>
                        <div className="text-green-800 font-bold mt-4">
                            {flight.flight_status === 'active' ? 'EN ROUTE AND ON TIME' : ''}
                        </div>
                        {
                            (flight.flight_status === 'scheduled') &&
                            <div className="text-red-800 font-bold mt-4">Flight is delayed</div>
                        }
                        {
                            (flight.flight_status === 'cancelled') &&
                            <div className="text-red-800 font-bold mt-4">Flight is cancelled</div>
                        }
                        <div className='text-left text-green-600'>
                            {
                                flight.arrival?.actual && flightInfo
                                ? `${flightInfo && getTime(flightInfo.far, flight.arrival.actual, flight.departure?.actual ?? '', flightInfo.dtoGoNumber).hours}h ${flightInfo && getTime(flightInfo.far, flight.arrival.actual, flight.departure?.actual ?? '', flightInfo.dtoGoNumber).minutes}m remaining`
                                : `${flightInfo && getTime(flightInfo.far, flight.arrival?.estimated ?? '', flight.departure?.actual ?? '', flightInfo.dtoGoNumber).hours}h ${flightInfo && getTime(flightInfo.far, flight.arrival?.estimated ?? '', flight.departure?.actual ?? '', flightInfo.dtoGoNumber).minutes}m remaining`
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <IoIosSettings color='blue' className='size-5 hover: cursor-pointer' />
                    {
                        manaInfo && <IoMdInformationCircle
                            className='size-5 mt-2 hover: cursor-pointer'
                            onClick={() => showDetail(flight.flight?.number ?? '', flight.flight_status ?? '')}
                        />
                    }
                </div>
            </div>

            <div className="pt-4 flex justify-between">
                <div className='text-left'>
                    <div className='text-xl'>{flight.departure?.icao}</div>
                    <div className="font-bold text-xl">{flight.departure?.timezone}</div>
                    <div className="text-sm">left
                        <span className="font-bold">
                            {flight.departure?.gate ? ` ${flight.departure.gate}` : ' none'}
                        </span>
                    </div>
                    <div className="text-blue-500"><a href="#">{flight.departure?.airport} - {flight.departure?.icao}</a></div>
                    <div className="text-sm font-normal">
                        {flight.departure?.actual
                            ? `${getDayOfWeek(flight.departure.actual.slice(0, 10) ?? '')} ${flight.departure.actual.slice(0, 10) ?? ''}`
                            : `${getDayOfWeek(flight.departure?.estimated?.slice(0, 10) ?? '')} ${flight.departure?.estimated?.slice(0, 10) ?? ''}`}
                    </div>
                    <div>
                        <span className="font-bold">
                            {flight.departure?.actual ? flight.departure.actual.slice(11) : flight.departure?.estimated?.slice(11)}
                        </span>
                        <span className="text-green-600">
                            {flight.flight_status === 'active' ? ' (on time)' : ''}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl text-right">{flight.arrival?.icao}</div>
                    <div className="font-bold text-xl">{flight.arrival?.timezone}</div>
                    <div className="text-sm">arriving at
                        <span className="font-bold">
                            {flight.arrival?.gate ? ` ${flight.arrival.gate}` : ' none'}
                        </span>
                    </div>
                    <div className="text-blue-500"><a href="#">{flight.arrival?.airport} - {flight.arrival?.icao}</a></div>
                    <div className="text-sm font-normal">
                        {flight.arrival?.actual
                            ? `${getDayOfWeek(flight.arrival.actual.slice(0, 10) ?? '')} ${flight.arrival.actual.slice(0, 10) ?? ''}`
                            : `${getDayOfWeek(flight.arrival?.estimated?.slice(0, 10) ?? '')} ${flight.arrival?.estimated?.slice(0, 10) ?? ''}`}
                    </div>
                    <div>
                        <span className="text-green-600">
                            ({flight.arrival?.actual || differenceInMinutes(parseISO(flight.arrival?.actual ?? ''), parseISO(flight.arrival?.estimated ?? '')) > 0
                            ? differenceInMinutes(parseISO(flight.arrival?.actual ?? ''), parseISO(flight.arrival?.estimated ?? '') + ' minutes early') 
                            : 'on schedule'})
                        </span>
                        <span className="font-bold">{flight.arrival?.actual ? flight.arrival.actual.slice(11) : flight.arrival?.estimated?.slice(11)}</span>
                    </div>
                </div>
            </div>

            <div className={`${isShow && manaInfo ? '' : 'hidden'}`}>
                {flightInfo && <InfoFlight flightInfo={flightInfo} flight={flight} />}
            </div>
        </div>
    );
}

export default ShowFlight;