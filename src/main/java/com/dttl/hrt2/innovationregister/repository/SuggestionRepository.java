package com.dttl.hrt2.innovationregister.repository;

import com.dttl.hrt2.innovationregister.model.Suggestion;

import org.springframework.data.repository.CrudRepository;

public interface SuggestionRepository extends CrudRepository<Suggestion, String> {
    
}
