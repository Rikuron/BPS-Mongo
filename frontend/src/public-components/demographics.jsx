import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, CartesianGrid, XAxis, YAxis , Bar , PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FaMale , FaFemale } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

const Demographics = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Age group calculations
  const calculateAgeGroups = (residents) => {
    const currentDate = new Date();
    const ageGroups = {
      children: { name: 'Children (0-14)', count: 0, percentage: 0 },
      youth: { name: 'Youth (15-24)', count: 0, percentage: 0 },
      adults: { name: 'Adults (25-59)', count: 0, percentage: 0 },
      seniors: { name: 'Seniors (60+)', count: 0, percentage: 0 }
    };

    residents.forEach(resident => {
      const birthDate = new Date(resident.birthdate);
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      if (age < 15) ageGroups.children.count++;
      else if (age >= 15 && age < 25) ageGroups.youth.count++;
      else if (age >= 25 && age < 60) ageGroups.adults.count++;
      else ageGroups.seniors.count++;
    });

    const totalResidents = residents.length;
    Object.keys(ageGroups).forEach(group => {
      ageGroups[group].percentage = 
        ((ageGroups[group].count / totalResidents) * 100).toFixed(1);
    });

    return { ageGroups, totalResidents };
  };

  // Gender distribution
  const calculateGenderDistribution = (residents) => {
    const genderCount = residents.reduce((acc, resident) => {
      acc[resident.gender] = (acc[resident.gender] || 0) + 1;
      return acc;
    }, {});

    const totalResidents = residents.length;
    return {
      male: ((genderCount['Male'] || 0) / totalResidents * 100).toFixed(1),
      female: ((genderCount['Female'] || 0) / totalResidents * 100).toFixed(1)
    };
  };

  // Occupations distribution calculation
  const calculateOccupationDistribution = (residents) => {
    const occupationCount = residents.reduce((acc, resident) => {
      acc[resident.occupation] = (acc[resident.occupation] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(occupationCount).map(([name, value]) => ({ name, value }));
  };

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.RESIDENTS);
        setResidents(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch residents');
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  if (loading) {
    return <div>Loading demographics...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const { ageGroups, totalResidents } = calculateAgeGroups(residents);
  const occupationsDistribution = calculateOccupationDistribution(residents);
  const genderDistribution = calculateGenderDistribution(residents);

  // Pie chart colors
  const AGE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const OCCUPATIONS_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0'];

  return (
    <div className="w-full h-auto py-14 flex items-center justify-center" style={{ background: 'var(--color-customGradient5)' }}>
      <div className="card w-[94%] h-auto pb-14 bg-white rounded-3xl shadow-[7px_6px_0_1.5px_var(--color-customBlue1)]">
        
        <div className="top-bar flex items-center px-8 py-5">
          <p className="font-patuaOneReg text-3xl ml-5"> Demographics Overview </p>
        </div>

        <hr className="my-0 border-t border-gray-300 w-full" />

        <div className="card-container flex justify-center mt-12 space-x-12">
          <div className="total-pop-card w-[42.5%] h-66 rounded-2xl shadow-lg bg-darkerWhite">
            <p className="font-patuaOneReg text-customBlue1 text-5xl pt-22 pl-8"> {totalResidents.toLocaleString()} residents</p>
            <p className="font-lexendReg opacity-65 text-2xl mt-10 pl-8"> Total Population </p>
          </div>
          <div className="pop-density-card w-[42.5%] h-66 rounded-2xl shadow-lg bg-darkerWhite">
            <p className="font-patuaOneReg text-customBlue1 text-5xl pt-22 pl-8"> {(totalResidents / 10).toLocaleString()} residents/km²</p>
            <p className="font-lexendReg opacity-65 text-2xl mt-10 pl-8"> Population Density (per km²) </p>
          </div>
        </div>

        <div className="flex w-[80%] mx-auto mt-8">
          <div className="age-chart w-[31rem]">
            <p className="font-patuaOneReg text-customDarkBlue2 text-3xl text-center py-3"> Age Distribution </p>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={Object.values(ageGroups)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {Object.values(ageGroups).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} (${props.payload.payload.percentage}%)`, 
                    name
                  ]}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card-group ml-20 space-y-4.5">
            {[
              { label: 'Children (0 - 14 years old)', group: 'children' },
              { label: 'Youth (15 - 24 years old)', group: 'youth' },
              { label: 'Adults (25 - 59 years old)', group: 'adults' },
              { label: 'Seniors (60+ years old)', group: 'seniors' }
            ].map(({ label, group }) => (
              <div key={group} className="w-[19rem] h-25 bg-darkerWhite rounded-3xl shadow-lg">
                <div className="flex pt-4 justify-center">
                  <p className="font-patuaOneReg text-customBlue1 text-3xl"> {ageGroups[group].percentage}% </p>
                  <div className="border-l border-gray-300 mx-4 h-10" />
                  <p className="font-patuaOneReg text-customDarkBlue2 text-3xl"> {ageGroups[group].count} </p>
                </div>
                <p className="font-lexendReg mt-2 text-center"> {label} </p>
              </div>
            ))}
          </div>
        </div>

        <div className="occupationss-chart w-[90%] mx-auto mt-8">
          <p className="font-patuaOneReg text-customDarkBlue2 text-3xl text-center py-3"> Occupations Distribution </p> 
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={occupationsDistribution} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex relative w-[90%] h-30 mx-auto px-8 mt-10 rounded-xl" style={{ background: 'var(--color-customGradient6)' }}>
          <FaMale className="w-[5rem] h-[5rem] my-auto z-10 text-white" />
          <div className="text-white my-auto ml-5 z-10">
            <p className="font-patuaOneReg text-4xl"> {genderDistribution.male}% </p>
            <p className="font-lexendReg text-2xl mt-1"> Male </p>
          </div>
          <p className="font-patuaOneReg text-white text-4xl my-auto mx-auto text-center z-10"> Gender <br /> Distribution </p>
          <div className="text-white my-auto mr-5 z-10">
            <p className="font-patuaOneReg text-4xl"> {genderDistribution.female}% </p>
            <p className="font-lexendReg text-2xl mt-1"> Female </p>
          </div>
          <FaFemale className="w-[5rem] h-[5rem] my-auto z-10 text-white" />
        </div>
        
      </div>
    </div>
  )
}

export default Demographics;