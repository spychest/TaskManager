<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class MercureService
{
    private HttpClientInterface $httpClient;

    private string $mercurePublishUrl;

    public function __construct(HttpClientInterface $httpClient, string $mercurePublishUrl)
    {
        $this->httpClient = $httpClient;
        $this->mercurePublishUrl = $mercurePublishUrl;
    }

    public function publishUpdate(): void
    {
        $request = $this->httpClient->request('GET', $this->mercurePublishUrl);
    }
}
