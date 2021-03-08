package com.dttl.hrt2.innovationregister.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "suggestions")
@Data
public class Suggestion {
    public enum SuggestionStatus {
        REVIEW,
        APPROVED,
        REJECTED,
        DEVELOP,
        COMPLETE;
    }

    @Id
    private String suggestionId;

    private String submittedBy;

    private Date submittedOn;

    private String suggestionTitle;

    private String suggestionDescription;

    private boolean onProductRoadmap;

    @Enumerated(EnumType.STRING)
    private SuggestionStatus suggestionStatus;
}
