import React, { useEffect } from 'react'
import { FlightData } from '../../models/FlightData';
import ShowFlight from './ShowFlight';
import { getAllFlightsByStatus } from '../../services/FlightResponse.service';
import Pagination from '../common/Pagination';
import { set } from 'date-fns';

const Flight: React.FC = () => {
    const [flights, setFlights] = React.useState<FlightData[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string>("");
    const [isInfo, setIsInfo] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<string>("active");
    const [page, setPage] = React.useState<number>(0);
    const [total, setTotal] = React.useState<number>(0);
    const [limit, setLimit] = React.useState<number>(10);
    const [manaInfo, setManaInfo] = React.useState<boolean>(true);

    const fetchFlights = async () => {
        try {
            const flightsData = await getAllFlightsByStatus(page, limit, status);
            setFlights(flightsData.content);
            setTotal(flightsData.totalPages);
        } catch (error) {
            setError("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights();
    }, [page, status]);

    if (loading) {
        return (
            <div className='flex align-middle text-center size-56'>
                <h1 className='size-56'>Đang tải...</h1>
            </div>
        )

    }
    if (error) {
        return <h1>{error}</h1>
    }

    const totalPages = Math.ceil(total / limit);

    return (
        <div className='bg-slate-100'>
            <div className='flex pt-5 px-5'>
                <div className='flex-grow text-right'>
                    <div className='text-right'>
                        {
                            flights.map((flight: FlightData, index: number) => (
                                <ShowFlight key={index} flight={flight} manaInfo={manaInfo} loading={loading} />
                            ))
                        }
                    </div>
                    <div>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
                <div className='w-1/6 text-left'>
                    <button
                        className={`mx-2 w-40 my-3 ${status === 'active' ? 'bg-blue-500' : 'bg-gray-200'} text-white px-4 py-2 rounded`}
                        onClick={() => {
                            setStatus('active'); setManaInfo(true);
                        }}
                    >
                        Active
                    </button>
                    <br /> <br />
                    <button
                        className={`mx-2 w-40 my-3 ${status === 'cancelled' ? 'bg-blue-500' : 'bg-gray-200'} text-white px-4 py-2 rounded`}
                        onClick={() => {
                            setStatus('cancelled'); setManaInfo(false);
                        }}
                    >
                        Cancelled
                    </button>
                    <br /> <br />
                    <button
                        className={`mx-2 w-40 my-3 ${status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-200'} text-white px-4 py-2 rounded`}
                        onClick={() => {
                            setStatus('scheduled'); setManaInfo(false);
                        }}
                    >
                        Scheduled
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Flight
