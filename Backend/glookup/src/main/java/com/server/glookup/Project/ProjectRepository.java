package com.server.glookup.Project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Integer>{
	
	@Query(value = "SELECT * FROM project WHERE collaborator_a = :studentId OR collaborator_b = :studentId", nativeQuery = true)
	List<Project> getProjectsByStudentId(@Param("studentId") int studentId );

}
