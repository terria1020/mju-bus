package com.mjubus.busserver.scheduler;

import com.mjubus.busserver.domain.BusArrival;
import com.mjubus.busserver.domain.Station;
import com.mjubus.busserver.repository.prod.BusArrivalRepository;
import com.mjubus.busserver.repository.prod.BusRepository;
import com.mjubus.busserver.repository.prod.StationRepository;
import com.mjubus.busserver.repository.staging.BusArrivalStagingRepository;
import com.mjubus.busserver.util.DateHandler;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Getter
@Component
public class RedBusScheduler {

    public static String SERVICE_KEY;

    private final String BASE_URL = "http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList";

    // Route ID <-> Bus Id
    private static final HashMap<String, Long> busId = new HashMap<String, Long>(){{
        put("228000176", 200L); //5001
        put("228000177", 201L); //5001-1
        put("228000182", 202L); //5003B
        put("228000174", 210L); //5000B
        put("228000394", 211L); //5002A
        put("228000183", 212L); //5002B
        put("228000175", 213L); //5005
        put("228000184", 214L); //5600
        put("228000395", 215L); //5700A
        put("228000271", 216L); //5700B
    }};

    private static final HashMap<String, Long> stationIdList = new HashMap<String, Long>() {{
        put("228002023", 4L); // 진입로 (명지대 방향)
        put("228001414", 202L); // 용인터미널 1 : 5001, 5600
        put("228000197", 200L); // 용인터미널 2 : 5700, 5002 , 5005
    }};

    private Document doc;

    @Autowired
    private BusArrivalRepository busArrivalRepository;

    @Autowired
    private BusArrivalStagingRepository busArrivalStagingRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private StationRepository stationRepository;

    @Value("${external.bus.key}")
    public void setKey(String key) {
        this.SERVICE_KEY = key;
    }

    private String buildURL(String stationId) throws UnsupportedEncodingException {
        return new StringBuilder(BASE_URL)
                .append("?")
                .append(URLEncoder.encode("serviceKey", "UTF-8"))
                .append("=")
                .append(SERVICE_KEY)
                .append("&")
                .append(URLEncoder.encode("stationId", "UTF-8"))
                .append("=")
                .append(stationId)
                .toString();
    }

    private Document GET(String URL) throws ParserConfigurationException, IOException, SAXException, TransformerException {
        DocumentBuilderFactory dbFactoty = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactoty.newDocumentBuilder();
        return dBuilder.parse(URL);
    }

    private String getRouteId(Element element) {
        NodeList nodeList = element.getElementsByTagName("routeId").item(0).getChildNodes();
        Node node = nodeList.item(0);
        if (node != null) {
            return node.getNodeValue();
        }
        return null;
    }

    private List<String> getPredictTimes(Element element) {
        LinkedList<String> list = new LinkedList<>();

        NodeList nodeList = element.getElementsByTagName("predictTime1").item(0).getChildNodes();
        Node node = nodeList.item(0);

        if (node != null)
            list.add(node.getNodeValue());

        nodeList = element.getElementsByTagName("predictTime2").item(0).getChildNodes();
        node = nodeList.item(0);

        if (node != null)
            list.add(node.getNodeValue());

        return list;
    }

    @Scheduled(cron = "0 * * * * *") // 1분 마다
    public void run() {
        try{
            for (String stationId: stationIdList.keySet()) {
                // URL, 정류장, 도착 정보
                String URL = buildURL(stationId);
                Station station = stationRepository.getReferenceById(stationIdList.get(stationId));

                // Request 및 parsing
                Document res = GET(URL);
                NodeList busArrivalList = res.getElementsByTagName("busArrivalList");

                for (int i = 0; i < busArrivalList.getLength(); i++) {
                    Node node = busArrivalList.item(i);

                    if (node.getNodeType() == Node.ELEMENT_NODE) {
                        String routeId = getRouteId((Element) node);
                        List<String> predictTimes = getPredictTimes((Element) node);

                        for(String predict: predictTimes) {
                            if (busId.get(routeId) != null) {
                                UUID uuid = UUID.randomUUID();
                                System.out.println(routeId);
                                System.out.println("\t예상 : " + Long.parseLong(predict));
                                System.out.println("\t도착 예상 : " + DateHandler.getToday().plusSeconds(Long.parseLong(predict) * 60));

                                BusArrival busArrival = BusArrival.builder()
                                        .sid(uuid.toString())
                                        .preSid(uuid.toString())
                                        .bus(busRepository.getReferenceById(busId.get(routeId)))
                                        .station(station)
                                        .expected(DateHandler.getToday().plusSeconds(Long.parseLong(predict) * 60))
                                        .build();
                                try {
                                    busArrivalRepository.save(busArrival);
                                    busArrivalStagingRepository.save(busArrival);
                                } catch (Exception ignored) {}

                            }
                        }

                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
