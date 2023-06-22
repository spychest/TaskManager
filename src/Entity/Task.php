<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private \DateTimeInterface $dueDate;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\Length(
        max: 500,
        maxMessage: 'Your description cannot be longer than {{ limit }} characters',
    )]
    private ?string $description = null;

    public function __construct(string $name, string $dueDate, ?string $description = null)
    {
        if(empty($name) || empty($dueDate)){
            throw new \RuntimeException("Le nom et la date de la tâche ne peuvent pas être non définies, null ou vide");
        }
        $this->name = $name;

        try {
            $this->dueDate = new \DateTime($dueDate);
        } catch (\Exception $e) {
            throw new \RuntimeException("La date de la tâche doit être une chaine de caractères datetime-local valide.");
        }

        if(strlen($description) > 500){
            throw new \RuntimeException("La description de la tâche ne peut pas depasser les 500 caractères.");
        }
        $this->description = $description;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDueDate(): ?\DateTimeInterface
    {
        return $this->dueDate;
    }

    public function setDueDate(\DateTimeInterface $dueDate): static
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function isForToday(): bool
    {
        $todayAsString = (new \DateTime())->format('d/m/Y');
        $dueDateAsString = $this->dueDate->format('d/m/Y');
        return $todayAsString === $dueDateAsString;
    }
}
