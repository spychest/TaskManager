<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class MercureService
{
    private const PUBLISHER_URL = "http://webserver-task/publish";

    private HttpClientInterface $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function publishUpdate(): void
    {
        $request = $this->httpClient->request('GET', self::PUBLISHER_URL);
    }
}
