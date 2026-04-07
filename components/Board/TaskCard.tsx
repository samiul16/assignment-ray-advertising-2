"use client";

import { Task } from "@/types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditTaskModal from "@/components/EditTaskModal";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { DragIndicator as DragIndicatorIcon } from "@mui/icons-material/DragIndicator";

interface Props {
  task: Task;
  isOverlay?: boolean;
}

export default function TaskCard({ task, isOverlay }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Make original card transparent while dragging
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
        boxShadow: isOverlay ? 6 : 1,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        "&:hover .edit-btn": { opacity: 1 },
      }}
    >
      <CardContent sx={{ p: "12px !important" }}>
        <Box display="flex" alignItems="flex-start" gap={1}>
          <Box
            {...attributes}
            {...listeners}
            sx={{ mt: 0.5, color: "text.secondary" }}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>

          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight={600} lineHeight={1.2}>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {task.description}
            </Typography>
          </Box>
        </Box>

        <Box
          className="edit-btn"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            opacity: { xs: 1, md: 0 },
            transition: "0.2s",
          }}
        >
          <EditTaskModal task={task} />
        </Box>
      </CardContent>
    </Card>
  );
}
