import { useState, useEffect } from 'react'
import Header from '@/Components/Header/Header';
import { Button, Form, InputGroup, Table, Row, Col } from 'react-bootstrap';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetAllCompany } from '@/Model/GetAllCompany';
import { Link, NavLink } from 'react-router-dom';

export default function ApprovalCompany() {

    const [searchQuery, setSearchQuery] = useState('');
    const [dataCompany, setDataCompany] = useState<GetAllCompany[]>([]);
    const [dataFetched, setDataFetched] = useState(false);

    const [selectedDateRange, setSelectedDateRange] = useState<string>('Last 30 days');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const companyApi = new CompanyApi();

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleDateRangeChange = (range: string) => {
        setSelectedDateRange(range);
        setDropdownVisible(false);
    };

    const getCompany = async () => {
        try {
            const res = await companyApi.GetAllCompanyNoAccept();
            setDataCompany(res);
            setDataFetched(true);

        } catch (error) {
            console.error('Error fetching general users:', error);
        }
    }

    const filteredData = dataCompany.filter((company) =>
        company?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentItems);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!dataFetched) {
            getCompany();
        }
    }, [dataFetched]);

    return (
        <>
            <Header />
            <br />
            <div>
                <Row>
                    <Col xs={2} style={{ height: '100wh' }}>
                        <hr />
                        <div className="h-screen px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <Link to="/ListGeneralUser" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap">บุคคลทั่วไป</span>
                                    </Link>
                                </li>
                            </ul>
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <Link to="/ListCompany" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap">ข้อมูลบริษัท</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <Col xs={10}>
                        <div className='container'>
                            <hr />
                            <br />
                            <p><b>รายชื่อบริษัท</b></p>
                            <br />
                            <hr />
                            <br />
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <div className="flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                                    <div>
                                        <button
                                            id="dropdownRadioButton"
                                            onClick={toggleDropdown}
                                            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                            type="button"
                                        >
                                            <svg
                                                className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                                            </svg>
                                            {selectedDateRange}
                                            <svg
                                                className="w-2.5 h-2.5 ms-2.5"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m1 1 4 4 4-4"
                                                />
                                            </svg>
                                        </button>
                                        {/* Dropdown menu */}
                                        {dropdownVisible && (
                                            <div
                                                id="dropdownRadio"
                                                className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                                            >
                                                <ul
                                                    className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                                                    aria-labelledby="dropdownRadioButton"
                                                >
                                                    {['Last day', 'Last 7 days', 'Last 30 days', 'Last month', 'Last year'].map(
                                                        (range) => (
                                                            <li key={range}>
                                                                <div
                                                                    className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                                                    onClick={() => handleDateRangeChange(range)}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        value={range}
                                                                        name="filter-radio"
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                        checked={selectedDateRange === range}
                                                                        readOnly
                                                                    />
                                                                    <label
                                                                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                                                    >
                                                                        {range}
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="table-search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="table-search"
                                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Search for items"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {filteredData.length > 0 ? (
                                    <><table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    ชื่อบริษัท
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    ประเภทธุรกิจ
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    เว็บไซต์
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    ปีที่ก่อตั้ง
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.map((item: GetAllCompany, index: number) => (
                                                <tr
                                                    key={index}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                    <td className="px-6 py-4">{item.name}</td>
                                                    <td className="px-6 py-4">{item.businessType}</td>
                                                    <td className="px-6 py-4">{item.website}</td>
                                                    <td className="px-6 py-4">{item.yearFounded}</td>
                                                    <td className="px-6 py-4">
                                                        {typeof window !== 'undefined' && (
                                                            <NavLink to={`/ApprovalCompany/${item.id}`}>
                                                                <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">แสดงข้อมูล</button>
                                                            </NavLink>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table><div>
                                            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                                                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                                    <li>
                                                        <button
                                                            onClick={() => handleClick(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                        >
                                                            Previous
                                                        </button>
                                                    </li>
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <li key={i}>
                                                            <button
                                                                onClick={() => handleClick(i + 1)}
                                                                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === i + 1 ? 'text-blue-600 border border-gray-300 bg-blue-50' : 'text-gray-500 bg-white border border-gray-300'} hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                                            >
                                                                {i + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li>
                                                        <button
                                                            onClick={() => handleClick(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                        >
                                                            Next
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                            <br />
                                        </div></>
                                ) : (
                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                        <p>Not Found Data Company</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            //
            <div id='con1' className="container">
                <div id='headerCon1'>
                    <p>รายชื่อบริษัทที่รอการอนุมัติ</p>
                    <Link to="/ListGeneralUser">
                        <Button variant="primary">บุคคลทั่วไป</Button>
                    </Link>
                    <br />
                    <Link to="/ListCompany">
                        <Button variant="primary">ข้อมูลบริษัท</Button>
                    </Link>
                </div>
                <hr />
                <div id='headerCon2'>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="ค้นหาชื่อ..."
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </div>
                <div id='general-btn'></div>
                <br />
                <div id='tableCon2'>
                    {filteredData.length > 0 ? (
                        <Table striped bordered hover variant="write">
                            <thead>
                                <tr>
                                    <th>no.</th>
                                    <th>ชื่อบริษัท</th>
                                    <th>ชื่อย่อบริษัท</th>
                                    <th>ประเภทธุรกิจ</th>
                                    <th>เว็บไซต์</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item: GetAllCompany, index: number) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.abbreviation}</td>
                                        <td>{item.businessType}</td>
                                        <td>{item.website}</td>
                                        <td>
                                            {typeof window !== 'undefined' && (
                                                <NavLink to={`/ApprovalCompany/${item.id}`}>
                                                    <Button variant="warning">แสดงข้อมูล</Button>
                                                </NavLink>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Not found data company</p>
                    )}
                </div>
            </div>
        </>
    );
}