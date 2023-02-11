import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TaxiNmap from "../screens/Taxi/TaxiNmap";
import TaxiStart from "../screens/Taxi/TaxiStart";
import TaxiDestination from "../screens/Taxi/TaxiDestination";
import TaxiDetail from "../screens/Taxi/TaxiDetail";
import TaxiPartyCreate from "../screens/Taxi/TaxiPartyCreate";
const Search = createNativeStackNavigator();

function TaxiStack() {
  return (
    <Search.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Search.Screen name="TaxiNmap" component={TaxiNmap} />
      <Search.Screen name="TaxiStartk" component={TaxiStart} />
      <Search.Screen name="TaxiDestination" component={TaxiDestination} />
      <Search.Screen name="TaxiDetail" component={TaxiDetail} />
      <Search.Screen name="TaxiPartyCreate" component={TaxiPartyCreate} />
    </Search.Navigator>
  );
}

export default TaxiStack;
