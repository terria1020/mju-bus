/* eslint-disable global-require */
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import {
  ActivityIndicator,
  AppState,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinkScreen from "../../components/LinkScreen";
import RunningBus, { NoSiweList } from "../../components/RunningBus";
import { busApi, stationApi } from "../../api";
import RunningRedBus from "../../components/RunningRedBus";
import RouteSelect from "./RouteSelect";
import { stationId } from "../../id";

const STORAGE_KEY = "@routes";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.FlatList`
  background-color: ${props => props.theme.homeBgColor};
  padding: 0 20px;
`;

const NoticeContainer = styled.View`
  width: 100%;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
`;

const LogoContainer = styled.View`
  width: 150px;
  height: 100%;
  flex-direction: row;
  margin-top: 20px;
`;

const LogoText = styled.Text`
  font-family: "SpoqaHanSansNeo-Bold";
  font-size: 22px;
  margin-left: 10px;
  color: #b1b8c0;
`;

const LinkContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 20px;
`;

const RunningBusContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 30px;
`;
const RedBusComingContainer = styled.View`
  width: 100%;
  margin-top: 20px;
`;

const TitleContainer = styled.View`
  width: 100%;
  padding: 0 10px;
  margin-bottom: 20px;
`;
const Title = styled.Text`
  font-family: "SpoqaHanSansNeo-Bold";
  font-size: 20px;
  color: ${props => props.theme.mainTextColor};
`;

const SubTitle = styled.Text`
  font-family: "SpoqaHanSansNeo-Medium";
  font-size: 15px;
  color: ${props => props.theme.subTextColor};
  margin-top: 10px;
`;

// eslint-disable-next-line react/prop-types
function Home({ route: { params }, navigation: { navigate } }) {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  // 앱이 백그라운드에서 돌아왔을 때 강제 refetch 진행
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        queryClient.invalidateQueries();
        queryClient.refetchQueries(["remain", "status"]);
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, [queryClient]);

  const loadSelectedRoutes = async () => {
    try {
      const string = await AsyncStorage.getItem(STORAGE_KEY);
      if (string != null) {
        setSelectedRoutes(JSON.parse(string));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    await queryClient.refetchQueries(["remain", "status"]);
    setRefreshing(false);
  };

  const onStart = () => {
    setModalVisible(true);
  };

  const redBusRemain = useQueries({
    queries: [
      {
        queryKey: ["remain", stationId.JinIpRo.id, undefined, true, true],
        queryFn: stationApi.remain,
      },
      {
        queryKey: [
          "remain",
          stationId.YongInTerminal.id,
          undefined,
          true,
          true,
        ],
        queryFn: stationApi.remain,
      },
    ],
  });

  const SiweStatus = useQueries({
    // eslint-disable-next-line react/prop-types
    queries: params?.busListData[1]?.busList.map(data => ({
      queryKey: ["timeTable", data.id],
      queryFn: busApi.timeTable,
    })),
  });

  const SineStatus = useQueries({
    // eslint-disable-next-line react/prop-types
    queries: params?.busListData[0]?.busList?.map(data => ({
      queryKey: ["status", data.id],
      queryFn: busApi.status,
    })),
  });

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadSelectedRoutes();
  }, [modalVisible]);

  const SineStatusisLoading = SineStatus.some(result => result.isLoading);
  const redBusRemainisLoading = redBusRemain.some(result => result.isLoading);
  const SiweStatusisLoading = SiweStatus.some(result => result.isLoading);
  const loading =
    redBusRemainisLoading || SineStatusisLoading || SiweStatusisLoading;

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <SafeAreaProvider>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <StatusBar />
        <Container
          width={SCREEN_WIDTH}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListHeaderComponent={
            <>
              <NoticeContainer>
                <LogoContainer>
                  <Image source={require("../../assets/image/Logo.png")} />
                  <LogoText>Bus Alarm</LogoText>
                </LogoContainer>
                <TouchableOpacity
                  onPress={() => {
                    navigate("NoticeStack", {
                      screen: "Notice",
                    });
                  }}
                >
                  <Ionicons name="notifications" size={28} color="#B1B8C0" />
                </TouchableOpacity>
              </NoticeContainer>
              <LinkContainer>
                <LinkScreen screenName="시간표" />
              </LinkContainer>

              <RunningBusContainer>
                <TitleContainer>
                  <Title>운행중인 버스</Title>
                </TitleContainer>
                <RunningBus bustype="sine" data={SineStatus} />
                {SiweStatus.length === 0 ? (
                  <NoSiweList />
                ) : (
                  <TouchableOpacity onPress={onStart}>
                    <RunningBus bustype="siwe" data={selectedRoutes} />
                  </TouchableOpacity>
                )}
                {modalVisible ? (
                  <RouteSelect
                    data={SiweStatus}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    selectedRoutes={selectedRoutes}
                  />
                ) : null}
              </RunningBusContainer>

              <RedBusComingContainer>
                <TitleContainer>
                  <Title>빨버 언제와?</Title>
                  <SubTitle>
                    진입로, 용인터미널 빨간 버스 도착 정보예요
                  </SubTitle>
                </TitleContainer>
                <RunningRedBus data={redBusRemain} />
              </RedBusComingContainer>
            </>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default Home;
