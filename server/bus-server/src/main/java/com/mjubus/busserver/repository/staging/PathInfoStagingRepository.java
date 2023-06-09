package com.mjubus.busserver.repository.staging;

import com.mjubus.busserver.domain.PathInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PathInfoStagingRepository extends JpaRepository<PathInfo, Long> {

    PathInfo findPathInfoByStationFrom_IdAndStationAt_Id(Long stationFrom_id, Long stationAt_id);
}