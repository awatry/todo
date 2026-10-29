package net.watrys.todo.model;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    protected Integer createdBy;

    @Column(nullable = false, updatable = false)
    protected Instant createdAt;

    @Column(nullable = false)
    protected Integer updatedBy;

    @Column(nullable = false)
    protected Instant updatedAt;

    @Column(nullable = false)
    private ItemType type;

    @Column(nullable = true)
    private String itemText;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("complete DESC, position ASC")
    private List<ListItem> subItems;

    @JoinColumn(name = "parent_id", nullable = true, updatable = false, insertable = false, referencedColumnName = "id")
    @ManyToOne(targetEntity = ListItem.class)
    @JsonIgnore
    private ListItem parent;

    @Column(name="parent_id", insertable=true, updatable = true)
    private Integer parentId;

    @JoinColumn(name = "list_id", nullable = false, updatable = false, insertable = false, referencedColumnName = "id")
    @ManyToOne(targetEntity = TodoList.class)
    @JsonIgnore
    private TodoList todoList;

    @Column(name = "list_id", nullable=false, insertable=true, updatable=true)
    private Integer todoListId;

    @Builder.Default
    @Column(nullable = false)
    private Boolean complete = Boolean.FALSE;

    public ListItem(String title, ItemType type, String itemText, Integer todoListId, Integer parentId){
        this.title = title;
        this.type = type;
        this.todoListId = todoListId;
        this.itemText = itemText;
        this.parentId = parentId;
    }

    @PrePersist
    private void prePersist() {
        preUpdate();
        this.createdBy = 1;
        this.createdAt = Instant.now();
    }

    @PreUpdate
    private void preUpdate() {
        this.updatedBy = 1;
        this.updatedAt = Instant.now();
    }
}