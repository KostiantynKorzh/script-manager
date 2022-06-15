package me.study.scriptmanager.model;


import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "scripts")
public class Script extends BaseModel {

    @Column(unique = true)
    private String name;

    private String body;

    @Type(type = "jsonb")
    @Column(name = "params", columnDefinition = "jsonb")
    private String params;

}
