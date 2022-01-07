package me.study.scriptmanager.service;

import me.study.scriptmanager.model.Script;
import me.study.scriptmanager.repository.ScriptRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScriptService {

    private final ScriptRepository scriptRepository;

    public ScriptService(ScriptRepository scriptRepository) {
        this.scriptRepository = scriptRepository;
    }

    public List<Script> getAllScripts(){
        return scriptRepository.findAll();
    }

}
