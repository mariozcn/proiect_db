package com.example.proiect_db.Model;

import com.example.proiect_db.Enum.Dosage;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "medications")
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Enumerated(EnumType.STRING)
    @Column(name = "dosage_form", nullable = false)
    private Dosage dosageForm;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    public Medication() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public Dosage getDosageForm() {
        return dosageForm;
    }

    public void setDosageForm(Dosage dosageForm) {
        this.dosageForm = dosageForm;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Medication(Integer id, String name, String manufacturer, Dosage dosageForm, BigDecimal unitPrice, Integer stockQuantity, LocalDate expiryDate) {
        this.id = id;
        this.name = name;
        this.manufacturer = manufacturer;
        this.dosageForm = dosageForm;
        this.unitPrice = unitPrice;
        this.stockQuantity = stockQuantity;
        this.expiryDate = expiryDate;
    }

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

}
