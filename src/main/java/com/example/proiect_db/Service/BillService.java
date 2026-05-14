package com.example.proiect_db.Service;

import com.example.proiect_db.Model.Bill;
import com.example.proiect_db.Repository.BillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillService {
    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    //GET
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id).orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
    }

    //POST
    public Bill createBill(Bill bill) {
        return billRepository.save(bill);
    }

    //PUT
    public Bill updateBill(Long id, Bill bill) {
        Bill existent = billRepository.findById(id).orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
        existent.setPatient(bill.getPatient());
        existent.setAdmission(bill.getAdmission());
        existent.setTotalAmount(bill.getTotalAmount());
        existent.setPaidAmount(bill.getPaidAmount());
        existent.setStatus(bill.getStatus());
        existent.setIssueDate(bill.getIssueDate());
        existent.setDueDate(bill.getDueDate());
        return billRepository.save(existent);
    }

    //DELETE
    public void deleteBill(Long id) {
        Bill bill = billRepository.findById(id).orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
        billRepository.delete(bill);
    }
}