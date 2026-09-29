package net.watrys.todo.model;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListItem {

    public enum ItemType {
        SECTION, LIST_ITEM
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    protected String title;

    @Column(nullable = false)
    protected Integer position;

    @Column(nullable = false, updatable = false)
    protected Integer createdUser;

    @Column(nullable = false, updatable = false)
    protected Instant createdAt;

    @Column(nullable = false)
    protected Integer updatedUser;

    @Builder.Default
    @Column(nullable = false)
    protected Instant updatedAt = Instant.now();

    @Column(nullable = false)
    private ItemType type;

    @Column(nullable = true)
    private String itemText;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("complete DESC, position ASC")
    private List<ListItem> subItems;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ListItem parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id")
    private TodoList todoList;

    @Builder.Default
    @Column(nullable = false)
    private Boolean complete = Boolean.FALSE;

    public ListItem(String title, ItemType type, String itemText, TodoList todoList, ListItem parent){
        this.title = title;
        this.type = type;
        this.todoList = todoList;
        this.itemText = itemText;
        this.parent = parent;
    }

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
}