package me.study.scriptmanager.repository;

import me.study.scriptmanager.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}
