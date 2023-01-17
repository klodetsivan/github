import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { authStore } from "../../../Redux/AuthState";
import { vacationsStore } from "../../../Redux/VacationsState";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";

export default function VacationsReports() {

  const [vacations, setVacation] = useState<VacationModel[]>([]);
  const [user, setUser] = useState<UserModel>();
  const navigate = useNavigate();

  console.log(vacations)
  useEffect(() => {
    // get user from redux 
    const user = authStore.getState().user
    // check if the user is admin or user 
    if (user?.roleId !== 'admin') {
      // if not admin - navigate back to vacations after 2 sec
      setTimeout(() => {
        navigate('/vacations')
      }, 2000)

      return
    }
    // update user 
    setUser(user)
    // listen to changes in user state 
    const unsubscribe = authStore.subscribe(() => {
      // update user if any change occurred 
      setUser(authStore.getState().user)
    })

    return () => {
      //to unsubscribe:
      unsubscribe();
    }

  }, []);

  useEffect(() => {
    loadVacations()
    setVacation(vacationsStore.getState().vacations)

    const unsubscribe = vacationsStore.subscribe(() => {

      setVacation(vacationsStore.getState().vacations)
    })

    return () => {
      //to unsubscribe:
      unsubscribe();
    }

  }, []);

  async function loadVacations(): Promise<void> {
    await vacationsService.getAllVacations()
      .then(vacations => setVacation(vacations))
      .catch(err => notifyService.error(err))
  }

  const data = vacations.filter(vac => +vac.followersCount !== 0)?.map(vac => ({
    destination: vac.destination,
    followersCount: vac.followersCount
  }))


  if (user?.roleId !== 'admin') return <h1>not allowed</h1>
   

  return (
    <div className="VacationsReports">
          

      <BarChart
        width={1500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 15,
          left: 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="destination" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar barSize={50}  dataKey="followersCount" fill="#8884d8" />

      </BarChart>
      

    </div>

    
  );
}
