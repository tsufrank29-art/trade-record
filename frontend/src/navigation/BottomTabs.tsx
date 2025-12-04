import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RoomsOverview from '@/screens/RoomsOverview';
import MyCreatedRooms from '@/screens/MyCreatedRooms';
import MyJoinedRooms from '@/screens/MyJoinedRooms';
import Profile from '@/screens/Profile';
import RoomDetail from '@/screens/RoomDetail';

export type RootTabParamList = {
  RoomsOverview: undefined;
  MyCreatedRooms: undefined;
  MyJoinedRooms: undefined;
  RoomDetail: { id: number } | undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="RoomsOverview">
        <Tab.Screen name="RoomsOverview" component={RoomsOverview} options={{ title: '房間總覽' }} />
        <Tab.Screen name="MyCreatedRooms" component={MyCreatedRooms} options={{ title: '我創建的房間' }} />
        <Tab.Screen name="MyJoinedRooms" component={MyJoinedRooms} options={{ title: '我加入的房間' }} />
        <Tab.Screen name="RoomDetail" component={RoomDetail} options={{ title: '房間' }} />
        <Tab.Screen name="Profile" component={Profile} options={{ title: '個人主頁' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabs;
