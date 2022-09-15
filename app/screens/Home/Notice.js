import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components";
import { Entypo } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGTH } = Dimensions.get("window");

const Container = styled.View`
  background-color: white;
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_HEIGTH}px;
`;

const NoticeDetailContainer = styled.View`
  width: ${SCREEN_WIDTH}px;
`;

const NoticeBannerContainer = styled.View`
  flex: 1;
  height: 100px;

  width: ${SCREEN_WIDTH}px;
  border-color: #f5f5f5;
  border-bottom-width: 1.5px;
  flex-direction: row;
`;

const NoticeBannerText = styled.View`
  flex: 5;
  flex-direction: column;
  padding-left: 20px;
  justify-content: center;
`;

const NoticeBannerButton = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const BannerTitle = styled.Text`
  font-family: "SpoqaHanSansNeo-Medium";
  font-size: 18px;
  color: black;
`;

const BannerDate = styled.Text`
  font-family: "SpoqaHanSansNeo-Medium";
  font-size: 13px;
  color: gray;
`;

const DetailTitleContainer = styled.View`
  width: ${SCREEN_WIDTH}px;
  height: 50px;
  justify-content: center;
  padding-left: 10px;
  background-color: #f5f5f5;
`;

const DetailTitle = styled.Text`
  font-family: "SpoqaHanSansNeo-Bold";
  font-size: 13px;
  color: #6d7582;
`;

const DetailImageContainer = styled.View`
  width: ${SCREEN_WIDTH}px;
  height: 50px;
  background-color: white;
`;
const DetailDescriptionContainer = styled.View`
  width: ${SCREEN_WIDTH}px;
  height: 50px;
  background-color: #f5f5f5;
  padding-top: 10px;
  padding-left: 20px;
`;

const DetailDescription = styled.Text`
  font-family: "SpoqaHanSansNeo-Medium";
  font-size: 13px;
  color: gray;
  padding-top: 10px;
`;
const data = [
  {
    id: 1,
    date: "2022/09/15",
    title: "MBA VERSION 1.0.0",
    img: "",
    subTitle: "#셔틀버스? 언제 오는지 확인하자",
    description: "블라블라블라",
  },
  {
    id: 2,
    date: "2022/09/15",
    title: "ICT 멘토링 프로젝트 관련 공지사항",
    img: "",
    subTitle: "#해당 에플리케이션은 ICT ~~~",
    description: "블라블라블라",
  },
];

function Notice() {
  const [selectedId, setSelectedId] = useState(false);

  function NoticeItem({
    id,
    date,
    title,
    img,
    subTitle,
    description,
    selectedId,
    setSelectedId,
  }) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (id === selectedId) {
            setSelectedId(null);
          } else {
            setSelectedId(id);
          }
        }}
      >
        <NoticeBannerContainer>
          <NoticeBannerText>
            <BannerDate>{date}</BannerDate>
            <BannerTitle>{title}</BannerTitle>
          </NoticeBannerText>
          <NoticeBannerButton>
            {id === selectedId ? (
              <Entypo name="chevron-small-up" size={30} color="gray" />
            ) : (
              <Entypo name="chevron-small-down" size={30} color="gray" />
            )}
          </NoticeBannerButton>
        </NoticeBannerContainer>
        {id === selectedId ? (
          <NoticeDetailContainer>
            <DetailTitleContainer>
              <DetailTitle>{subTitle}</DetailTitle>
            </DetailTitleContainer>
            <DetailImageContainer />
            <DetailDescriptionContainer>
              <DetailDescription>{description}</DetailDescription>
            </DetailDescriptionContainer>
          </NoticeDetailContainer>
        ) : null}
      </TouchableOpacity>
    );
  }

  const renderNoticeItem = ({ item }) => (
    <NoticeItem
      id={item.id}
      date={item.date}
      title={item.title}
      img={item.img}
      subTitle={item.subTitle}
      description={item.description}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["bottom", "top"]} style={{ flex: 1 }}>
        <StatusBar backgroundColor="white" />
        <Container>
          <FlatList
            extraData={selectedId}
            data={data}
            renderItem={renderNoticeItem}
          />
        </Container>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default Notice;
