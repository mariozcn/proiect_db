package com.example.proiect_db.Controller;

import com.example.proiect_db.Model.Bill;
import com.example.proiect_db.Service.BillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/bills")
public class BillController {
    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    //GET
    @GetMapping()
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public Bill getBillById(@PathVariable Long id) {
        return billService.getBillById(id);
    }

    //POST
    @PostMapping()
    public Bill createBill(@RequestBody Bill bill) {
        return billService.createBill(bill);
    }

    //PUT
    @PutMapping("/{id}")
    public Bill updateBill(@PathVariable Long id, @RequestBody Bill bill) {
        return billService.updateBill(id, bill);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public void deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
    }
}
