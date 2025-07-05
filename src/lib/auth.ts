import { User, UserProgram, UserProgress, UserSelections } from "@/types/auth";
import { SimpleProgram } from "@/types/simpleProgram";

// Internal types for localStorage data
interface StoredUser extends User {
  passwordHash: string;
}

interface StoredProgram extends Omit<UserProgram, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface StoredProgress extends Omit<UserProgress, 'startedAt' | 'lastWorkoutAt'> {
  startedAt: string;
  lastWorkoutAt?: string;
}

/**
 * Simple localStorage-based auth service (temporary until proper database)
 * Handles user authentication, program storage, and progress tracking
 */
class AuthService {
  private static readonly USERS_KEY = 'fitness_app_users';
  private static readonly PROGRAMS_KEY = 'fitness_app_programs';
  private static readonly PROGRESS_KEY = 'fitness_app_progress';
  private static readonly CURRENT_USER_KEY = 'fitness_app_current_user';

  /**
   * Register a new user with email, password, and name
   */
  async register(email: string, password: string, name: string): Promise<User> {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }

    const user: User = {
      id: this.generateId(),
      email,
      name,
      createdAt: new Date()
    };

    // In a real app, we'd hash the password
    const userWithPassword: StoredUser = { ...user, passwordHash: password };
    users.push(userWithPassword);
    localStorage.setItem(AuthService.USERS_KEY, JSON.stringify(users));

    return user;
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    const users = this.getUsers();
    const userWithPassword = users.find(u => u.email === email && u.passwordHash === password);
    
    if (!userWithPassword) {
      throw new Error('Invalid email or password');
    }

    const user: User = {
      id: userWithPassword.id,
      email: userWithPassword.email,
      name: userWithPassword.name,
      createdAt: new Date(userWithPassword.createdAt)
    };

    localStorage.setItem(AuthService.CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    localStorage.removeItem(AuthService.CURRENT_USER_KEY);
  }

  /**
   * Get the currently logged-in user
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(AuthService.CURRENT_USER_KEY);
    if (!userJson) return null;
    
    const user = JSON.parse(userJson) as User;
    return {
      ...user,
      createdAt: new Date(user.createdAt)
    };
  }

  /**
   * Save a new program for a user
   */
  async saveProgram(
    userId: string, 
    sportType: UserSelections['sportType'],
    userSelections: UserSelections,
    programData: SimpleProgram | Record<string, unknown>
  ): Promise<UserProgram> {
    const programs = this.getPrograms();
    
    // Deactivate any existing active program for this sport
    programs.forEach(p => {
      if (p.userId === userId && p.sportType === sportType) {
        p.isActive = false;
      }
    });

    const now = new Date();
    const program: UserProgram = {
      id: this.generateId(),
      userId,
      sportType,
      programName: this.generateProgramName(sportType, userSelections),
      programData,
      userSelections,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const storedProgram: StoredProgram = {
      ...program,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    programs.push(storedProgram);
    localStorage.setItem(AuthService.PROGRAMS_KEY, JSON.stringify(programs));

    // Initialize progress for this program
    await this.initializeProgress(userId, program.id);

    return program;
  }

  /**
   * Get all programs for a user
   */
  async getUserPrograms(userId: string): Promise<UserProgram[]> {
    const programs = this.getPrograms();
    return programs
      .filter(p => p.userId === userId)
      .map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
  }

  /**
   * Get the active program for a user
   */
  async getActiveProgram(userId: string): Promise<UserProgram | null> {
    const programs = await this.getUserPrograms(userId);
    return programs.find(p => p.isActive) || null;
  }

  /**
   * Initialize progress tracking for a new program
   */
  async initializeProgress(userId: string, programId: string): Promise<UserProgress> {
    const progressList = this.getProgress();
    
    const now = new Date();
    const progress: UserProgress = {
      id: this.generateId(),
      userId,
      programId,
      currentWeek: 1,
      currentDay: 1,
      completedDays: [],
      startedAt: now,
      status: 'active'
    };

    const storedProgress: StoredProgress = {
      id: progress.id,
      userId: progress.userId,
      programId: progress.programId,
      currentWeek: progress.currentWeek,
      currentDay: progress.currentDay,
      completedDays: progress.completedDays,
      startedAt: now.toISOString(),
      status: progress.status
    };

    progressList.push(storedProgress);
    localStorage.setItem(AuthService.PROGRESS_KEY, JSON.stringify(progressList));
    
    return progress;
  }

  /**
   * Get progress for a specific user and program
   */
  async getUserProgress(userId: string, programId: string): Promise<UserProgress | null> {
    const progressList = this.getProgress();
    const progress = progressList.find(p => p.userId === userId && p.programId === programId);
    
    if (!progress) return null;
    
    return {
      ...progress,
      startedAt: new Date(progress.startedAt),
      lastWorkoutAt: progress.lastWorkoutAt ? new Date(progress.lastWorkoutAt) : undefined
    };
  }

  /**
   * Update progress for a user's program
   */
  async updateProgress(
    userId: string, 
    programId: string, 
    updates: Partial<UserProgress>
  ): Promise<UserProgress> {
    const progressList = this.getProgress();
    const index = progressList.findIndex(p => p.userId === userId && p.programId === programId);
    
    if (index === -1) {
      throw new Error('Progress not found');
    }

    const now = new Date();
    const updatedStoredProgress: StoredProgress = {
      ...progressList[index],
      ...updates,
      startedAt: progressList[index].startedAt, // Keep original start date
      lastWorkoutAt: now.toISOString()
    };

    progressList[index] = updatedStoredProgress;
    localStorage.setItem(AuthService.PROGRESS_KEY, JSON.stringify(progressList));
    
    return {
      ...updatedStoredProgress,
      startedAt: new Date(updatedStoredProgress.startedAt),
      lastWorkoutAt: new Date(updatedStoredProgress.lastWorkoutAt!)
    };
  }

  // Helper methods
  private getUsers(): StoredUser[] {
    const usersJson = localStorage.getItem(AuthService.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private getPrograms(): StoredProgram[] {
    const programsJson = localStorage.getItem(AuthService.PROGRAMS_KEY);
    return programsJson ? JSON.parse(programsJson) : [];
  }

  private getProgress(): StoredProgress[] {
    const progressJson = localStorage.getItem(AuthService.PROGRESS_KEY);
    return progressJson ? JSON.parse(progressJson) : [];
  }

  /**
   * Generate a unique ID for users, programs, and progress
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a human-readable program name based on sport type and selections
   */
  private generateProgramName(sportType: string, selections: UserSelections): string {
    const sport = sportType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (sportType === 'running') {
      return `${sport} Program - ${selections.distance || 'Custom'}`;
    } else {
      return `${sport} Program - ${selections.daysPerWeek || 3} days/week`;
    }
  }
}

export const authService = new AuthService();