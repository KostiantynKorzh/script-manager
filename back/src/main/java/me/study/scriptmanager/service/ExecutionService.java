package me.study.scriptmanager.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.study.scriptmanager.model.Job;
import me.study.scriptmanager.model.Script;
import me.study.scriptmanager.repository.JobRepository;
import me.study.scriptmanager.repository.ScriptRepository;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static me.study.scriptmanager.utils.Constants.BASH_PATH;

@Service
public class ExecutionService {

    private final JobRepository jobRepository;
    private final ScriptRepository scriptRepository;

    private final ObjectMapper mapper;

    public ExecutionService(JobRepository jobRepository, ScriptRepository scriptRepository, ObjectMapper mapper) {
        this.jobRepository = jobRepository;
        this.scriptRepository = scriptRepository;
        this.mapper = mapper;
    }

    public String executeScriptFromString(String script, Map<String, Object> params) throws IOException {
        String formattedScript = addAssigningParamsToVariablesForScript(script, params);

        String[] command = {BASH_PATH, "-c", formattedScript};

        logFullCommand(command);

        return executeScriptAndReturnOutput(command);
    }

    private String addAssigningParamsToVariablesForScript(String script, Map<String, Object> params) {
        StringBuilder formattedScript = new StringBuilder(script);
        params.entrySet().forEach(entry -> {
            formattedScript.insert(0, entry.getKey() + "=" + entry.getValue() + '\n');
        });
        System.out.println("Formatted Script: " + formattedScript);

        return formattedScript.toString();
    }

    private void logFullCommand(String[] command) {
        StringBuilder fullCommand = new StringBuilder();
        for (String commandPart : command) {
            fullCommand.append(commandPart).append(" ");
        }

        System.out.println("Full Command: " + fullCommand);
    }

    private String executeScriptAndReturnOutput(String[] command) throws IOException {
        Process process = Runtime.getRuntime().exec(command);
        BufferedReader reader = new BufferedReader(new InputStreamReader(
                process.getInputStream()));
        StringBuilder scriptOutput = new StringBuilder();
        String s = "";
        while ((s = reader.readLine()) != null) {
            scriptOutput.append(s).append('\n');
        }

        return scriptOutput.toString();
    }

    public String executeJob(Long id, Map<String, Object> params) {
        StringBuilder jobResult = new StringBuilder();

        Job job = jobRepository.getById(id);
        List<Long> scriptsIds = convertScriptIdsFromStringToList(job.getScriptsIds());
        List<Script> scripts = createListOfScripts(scriptsIds);

        AtomicInteger counter = new AtomicInteger(1);

        Map<String, Object> scriptParamsWithJobsResults = new HashMap<>();
        scripts.forEach(script -> {
            try {
                Map<String, Object> allScriptParamsMap = mapper.readValue(script.getParams(), Map.class);
                Set<String> allScriptParams = allScriptParamsMap.keySet();

                params.keySet().forEach(jobParam -> {
                    if (allScriptParams.contains(jobParam)) {
                        scriptParamsWithJobsResults.put(jobParam, params.get(jobParam));
                    }
                });

                String scriptResult = executeScriptFromString(script.getBody(), scriptParamsWithJobsResults);

                jobResult.append(script.getName())
                        .append(" ----------------- \n")
                        .append(scriptResult)
                        .append('\n');

                scriptParamsWithJobsResults.put("script" + counter.getAndIncrement(), scriptResult);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return jobResult.toString();
    }

    public List<Script> createListOfScripts(List<Long> scriptsIds){
        List<Script> scripts = new LinkedList<>();
        scriptsIds.forEach(scriptId -> {
            Script script = scriptRepository.findById(scriptId).orElseGet(() -> {
                System.out.println("Can't find script with id: " + scriptId);
                return null;
            });
            if (script != null) {
                scripts.add(script);
            }
        });

        return scripts;
    }

    public List<Long> convertScriptIdsFromStringToList(String scriptsIdsString){
        return Arrays.stream(scriptsIdsString.split(",")).map(Long::parseLong).toList();
    }

}
