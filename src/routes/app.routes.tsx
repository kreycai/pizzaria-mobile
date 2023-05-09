import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Order from "../pages/Order";
import Dashboard from "../pages/Dashboard";
import { FinishOrder } from "../pages/FinishOrder";

export type StackParamsList = {
    Dashboard: undefined;
    Order: {
        order_id: string;
        number: number | string;
    },
    FinishOrder: {
        order_id: string;
        number: number | string;
    }
}

const Stack = createNativeStackNavigator<StackParamsList>();

function AppRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}}/>
            <Stack.Screen name="Order" component={Order} options={{headerShown: false}}/>
            <Stack.Screen name= "FinishOrder" component={FinishOrder} options={{
                title: 'Finalizando',
                headerStyle:{
                    backgroundColor: '#1d1d2e'
                },
                headerTintColor: '#fff'
                }}/>
        </Stack.Navigator>
    )
}

export default AppRoutes;