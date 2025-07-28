export interface MatchData {
  id: string
  date: string
  team1: string
  team2: string
  winner: string
  blueSide: string[]
  redSide: string[]
  duration: number
  type: 'scrim' | 'championship'
}

export interface GridPlayerData {
  playerId: string
  championId: string
  kda: { kills: number; deaths: number; assists: number }
  cs: number
  gold: number
  damage: number
  gameTime: number
}

// Google Sheets API service
export class GoogleSheetsService {
  private apiKey: string = ''

  constructor(apiKey?: string) {
    if (apiKey) this.apiKey = apiKey
  }

  async fetchSheetData(sheetId: string, range: string = 'A1:Z1000'): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('Google Sheets API key not configured')
    }

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${this.apiKey}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.values || []
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error)
      throw error
    }
  }

  async parseScrimData(sheetId: string): Promise<MatchData[]> {
    try {
      // Get all sheets in the workbook
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${this.apiKey}`
      const sheetsResponse = await fetch(sheetsUrl)
      const sheetsData = await sheetsResponse.json()

      const matches: MatchData[] = []
      
      // Find sheets with SCRIM pattern
      const scrimSheets = sheetsData.sheets?.filter((sheet: any) => 
        sheet.properties.title.match(/SCRIM\s+\d{2}\/\d{2}/i)
      ) || []

      for (const sheet of scrimSheets) {
        const sheetName = sheet.properties.title
        const data = await this.fetchSheetData(sheetId, `${sheetName}!A1:AF50`)
        
        // Parse matches from sheet data (simplified example)
        for (let i = 1; i < Math.min(data.length, 7); i++) { // Max 6 games per sheet
          if (data[i] && data[i][0]) {
            matches.push({
              id: `${sheetName}_${i}`,
              date: this.parseDate(sheetName),
              team1: data[i][5] || 'Blue Team', // Column F
              team2: data[i][10] || 'Red Team', // Column K
              winner: data[i][15] || 'Blue', // Column P
              blueSide: [data[i][5], data[i][6], data[i][7], data[i][8], data[i][9]].filter(Boolean),
              redSide: [data[i][10], data[i][11], data[i][12], data[i][13], data[i][14]].filter(Boolean),
              duration: 25, // Default duration
              type: 'scrim'
            })
          }
        }
      }

      return matches
    } catch (error) {
      console.error('Error parsing scrim data:', error)
      throw error
    }
  }

  private parseDate(sheetName: string): string {
    const match = sheetName.match(/(\d{2})\/(\d{2})/)
    if (match) {
      const [, day, month] = match
      return `2024-${month}-${day}`
    }
    return new Date().toISOString().split('T')[0]
  }
}

// GRID API service
export class GridApiService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async fetchPlayerData(playerId: string, gameId?: string): Promise<GridPlayerData[]> {
    try {
      // Mock implementation - replace with actual GRID API endpoints
      const response = await fetch(`https://api.grid.gg/v1/players/${playerId}/matches`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`GRID API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformGridData(data)
    } catch (error) {
      console.error('Error fetching GRID data:', error)
      // Return mock data for demonstration
      return this.getMockGridData()
    }
  }

  private transformGridData(rawData: any): GridPlayerData[] {
    // Transform GRID API response to our format
    return rawData.matches?.map((match: any) => ({
      playerId: match.participant.playerId,
      championId: match.participant.championId,
      kda: {
        kills: match.stats.kills,
        deaths: match.stats.deaths,
        assists: match.stats.assists
      },
      cs: match.stats.totalMinionsKilled,
      gold: match.stats.goldEarned,
      damage: match.stats.totalDamageDealtToChampions,
      gameTime: match.info.gameDuration
    })) || []
  }

  private getMockGridData(): GridPlayerData[] {
    return [
      {
        playerId: 'player1',
        championId: 'Jinx',
        kda: { kills: 8, deaths: 2, assists: 5 },
        cs: 245,
        gold: 15420,
        damage: 28500,
        gameTime: 1860
      },
      {
        playerId: 'player2',
        championId: 'Thresh',
        kda: { kills: 1, deaths: 4, assists: 12 },
        cs: 45,
        gold: 9200,
        damage: 8900,
        gameTime: 1860
      }
    ]
  }
}