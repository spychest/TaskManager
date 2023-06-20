<?php

namespace App\Controller;

use App\Entity\Task;
use App\Service\MercureService;
use App\Service\TaskService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
#[Route("/api/v2/tasks")]
class ApiController extends AbstractController
{
    private TaskService $taskService;
    private MercureService $mercureService;

    public function __construct(TaskService $taskService, MercureService $mercureService)
    {
        $this->taskService = $taskService;
        $this->mercureService = $mercureService;
    }

    #[Route("/", name: "api_tasks_list", methods: ["GET"])]
    public function index(): JsonResponse
    {
        $tasks = $this->taskService->getAllTasks();

        return $this->json($tasks);
    }

    #[Route("/create", name: "api_task_create", methods: ["POST"])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Créer une nouvelle tâche avec les données reçues
        $task = new Task($data['taskName'], $data['taskDueDate'], $data['taskDescription']);

        // Définir les propriétés de la tâche en fonction des données
        $this->taskService->registerTask($task);

        // Envoyer update via Mercure
        $this->mercureService->publishUpdate();

        // Gérer la réponse
        return $this->json(['message' => 'La nouvelle tâche a bien été enregistrée']);
    }

    #[Route("/{id}", name: "api_task_show", requirements: ["id" => "\d+"], methods: ["GET"])]
    public function show(int $id): JsonResponse
    {
        $task = $this->taskService->getTaskById($id);

        return $this->json($task);
    }

    #[Route("/{id}", name: "api_task_update", requirements: ["id" => "\d+"], methods: ["PUT"])]
    public function update(Request $request, int $id): Response
    {
        $data = json_decode($request->getContent(), true);

        $task = $this->taskService->getTaskById($id);

        if (!$task) {
            return $this->json([
                'Status' => 'Error',
                'Message' => 'La tâche que vous souhaitez modifier n\'existe pas.'
            ],
            404
            );
        }

        // Mettre à jour les propriétés de la tâche en fonction des données
        $task->setName($data['taskName'])
            ->setDueDate(new \DateTime($data['taskDueDate']))
            ->setDescription($data['taskDescription']);

        $this->taskService->registerTask($task);

        // Envoyer update via Mercure
        $this->mercureService->publishUpdate();

        // Gérer la réponse
        return $this->json(['message' => 'La tâche a bien été mise à jour']);
    }

    #[Route("/{id}", name: "api_task_delete", requirements: ["id" => "\d+"], methods: ["DELETE"])]
    public function delete(int $id): Response
    {
        $task = $this->taskService->getTaskById($id);

        if (!$task) {
            return $this->json([
                'Status' => 'Error',
                'Message' => 'La tâche que vous souhaitez modifier n\'existe pas.'
            ],
                404
            );
        }

        $this->taskService->removeTask($task);

        // Envoyer update via Mercure
        $this->mercureService->publishUpdate();

        return $this->json(['message' => 'La tâche a bien été supprimée']);
    }
}
