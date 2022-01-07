package me.study.scriptmanager.repository;

import me.study.scriptmanager.model.Script;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScriptRepository extends JpaRepository<Script, Long> {
}
