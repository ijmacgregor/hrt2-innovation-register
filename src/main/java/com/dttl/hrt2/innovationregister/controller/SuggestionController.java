package com.dttl.hrt2.innovationregister.controller;

import java.util.Date;
import java.util.UUID;

import com.dttl.hrt2.innovationregister.model.Suggestion;
import com.dttl.hrt2.innovationregister.model.Suggestion.SuggestionStatus;
import com.dttl.hrt2.innovationregister.repository.SuggestionRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SuggestionController {
    private final SuggestionRepository suggestionRepository;

    public SuggestionController(SuggestionRepository suggestionRepository){
        this.suggestionRepository = suggestionRepository;
    }

    @GetMapping("/suggestions")
    public Iterable<Suggestion> getSuggestions() {
        return this.suggestionRepository.findAll();
    }

    @PostMapping("/suggestion")
    public Suggestion createSuggestion(@RequestBody Suggestion suggestionIn){
        suggestionIn.setSuggestionId(UUID.randomUUID().toString());
        suggestionIn.setSubmittedOn(new Date());
        suggestionIn.setSubmittedBy("you@deloitte.com.au");
        suggestionIn.setSuggestionStatus(SuggestionStatus.REVIEW);

        return suggestionRepository.save(suggestionIn);
    }

    @PutMapping("/suggestion/{suggestionId}")
    public Suggestion updateSuggestion(@RequestBody Suggestion suggestionIn, @PathVariable(name = "suggestionId") String suggestionId){
        var suggestionDB = suggestionRepository.findById(suggestionId).orElseThrow();

        suggestionDB.setOnProductRoadmap(suggestionIn.isOnProductRoadmap());
        suggestionDB.setSuggestionTitle(suggestionIn.getSuggestionTitle());
        suggestionDB.setSuggestionDescription(suggestionIn.getSuggestionDescription());
        suggestionDB.setSuggestionStatus(suggestionIn.getSuggestionStatus());

        return suggestionRepository.save(suggestionDB);
    }

    @DeleteMapping("/suggestion/{suggestionId}")
    public void deleteSuggestion(@PathVariable(name = "suggestionId") String suggestionId){
        suggestionRepository.deleteById(suggestionId);
    }
}
