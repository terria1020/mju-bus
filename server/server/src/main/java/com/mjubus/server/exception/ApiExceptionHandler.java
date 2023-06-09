package com.mjubus.server.exception;

import com.mjubus.server.exception.Bus.BusNotFoundException;
import com.mjubus.server.exception.BusArrival.BusArrivalNotFoundException;
import com.mjubus.server.exception.BusTimeTable.BusTimeTableDetailNotFoundException;
import com.mjubus.server.exception.BusTimeTable.BusTimeTableNotFoundException;
import com.mjubus.server.exception.Path.PathDetailNotFoundException;
import com.mjubus.server.exception.Path.PathInfoNotFoundException;
import com.mjubus.server.exception.Route.RouteInfoNotFoundException;
import com.mjubus.server.exception.Route.RouteNotFoundException;
import com.mjubus.server.exception.Station.StationNotFoundException;
import io.sentry.Sentry;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Component
public class ApiExceptionHandler {

    @ExceptionHandler(BusNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(BusNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0001","No Bus is found with ID : " + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusCalenderNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(BusCalenderNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0002", "No Calendar is found in today" + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusTimeTableNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(BusTimeTableNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0003", "No BusTimeTable is found in Request" + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(StationNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(StationNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0004", "No Station is found in ID" + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RouteNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(RouteNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0005", "No Route is found in Params : " + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusTimeTableDetailNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(BusTimeTableDetailNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0006", "No Detail is found in INFO id : " + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RouteInfoNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(RouteInfoNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0007", "No Detail is found in INFO id : " + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusArrivalNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(BusArrivalNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0008", "No Bus remains in : " + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PathDetailNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(PathDetailNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0009", "No PathDetail remains in : " + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PathInfoNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleException(PathInfoNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse("ERROR-0010", "No PathInfo remains in : " + ex.getMessage());
        Sentry.captureException(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}