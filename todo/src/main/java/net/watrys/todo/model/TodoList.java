package net.watrys.todo.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    protected String title;

    @Column(nullable = false)
    protected Integer position;

    @Column(nullable = false)
    protected Integer createdUser;

    @Column(nullable = false)
    protected Instant createdAt;

    @Column(nullable = false)
    protected Integer updatedUser;

    @Column(nullable = false)
    protected Instant updatedAt;

    @PrePersist
    private void prePersist() {
        preUpdate();
        this.createdUser = 1;
        this.createdAt = Instant.now();
    }

    @PreUpdate
    private void preUpdate() {
        this.updatedUser = 1;
        this.updatedAt = Instant.now();
    }

    @OneToMany(mappedBy = "todoList", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("position ASC")
    private List<ListItem> topLevelItems;

    public TodoList(String title, Integer position) {
        this.title = title;
        this.position = position;
    }
}