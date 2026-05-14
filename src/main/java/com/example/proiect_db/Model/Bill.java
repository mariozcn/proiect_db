package com.example.proiect_db.Model;

import com.example.proiect_db.Enum.BillStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id")
    private Admission admission;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BillStatus status;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    public Bill() {
    }

    public Bill(Integer id, Patient patient, Admission admission, BigDecimal totalAmount, BigDecimal paidAmount, BillStatus status, LocalDate issueDate, LocalDate dueDate) {
        this.id = id;
        this.patient = patient;
        this.admission = admission;
        this.totalAmount = totalAmount;
        this.paidAmount = paidAmount;
        this.status = status;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Admission getAdmission() {
        return admission;
    }

    public void setAdmission(Admission admission) {
        this.admission = admission;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public BillStatus getStatus() {
        return status;
    }

    public void setStatus(BillStatus status) {
        this.status = status;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}