package me.study.scriptmanager.controller;

import me.study.scriptmanager.model.Script;
import me.study.scriptmanager.service.ScriptService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/scripts")
public class ScriptController {

    private final ScriptService scriptService;

    public ScriptController(ScriptService scriptService) {
        this.scriptService = scriptService;
    }

    @GetMapping
    public List<Script> getAllScripts() {
        return scriptService.getAllScripts();
    }

}
