package com.example.proiect_db.Controller;

import com.example.proiect_db.Model.Room;
import com.example.proiect_db.Service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    //GET
    @GetMapping()
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    //POST
    @PostMapping()
    public Room createRoom(@RequestBody Room room) {
        return roomService.createRoom(room);
    }

    //PUT
    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @RequestBody Room room) {
        return roomService.updateRoom(id, room);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }
}
