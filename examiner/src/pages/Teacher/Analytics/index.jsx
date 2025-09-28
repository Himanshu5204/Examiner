import React from 'react'
import { useAuth } from '../../Context/AuthContext'
import GenderPieChart from './GenderPieChart';
import StudentExamCharts from './StudentExamCharts';

const index = () => {
    const { user } = useAuth();
    console.log(user);
    return (
        <div>
            {/* <GenderPieChart /> */}
            <StudentExamCharts />
        </div>
    )
}

export default index