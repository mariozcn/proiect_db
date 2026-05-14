package com.example.proiect_db.Service;

import com.example.proiect_db.Model.Room;
import com.example.proiect_db.Repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    //GET
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    //POST
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    //PUT
    public Room updateRoom(Long id, Room room) {
        Room existent = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        existent.setRoomNumber(room.getRoomNumber());
        existent.setType(room.getType());
        existent.setCapacity(room.getCapacity());
        existent.setStatus(room.getStatus());
        existent.setDailyRate(room.getDailyRate());
        existent.setDepartment(room.getDepartment());
        return roomRepository.save(existent);
    }

    //DELETE
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        roomRepository.delete(room);
    }
}